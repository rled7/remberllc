/// <reference types="@cloudflare/workers-types" />

import { rateLimit } from '../../lib/rateLimit.js';

// Chess coach — on-demand LLM explanation for the /demos/chess board.
// Runs server-side so the API key stays private. Grounded in the engine's own
// eval numbers so the model explains rather than guesses the chess.
//
// Cost posture (public, high-volume, low-complexity endpoint):
//   • claude-sonnet-5 (override via EXPLAIN_MODEL), not Opus.
//   • thinking disabled + max_tokens capped at 220 — a move explanation is short.
// Set ANTHROPIC_API_KEY in the Pages project for this to work; without it the
// board still plays and the local eval bar still works — only "Explain" degrades.

interface Env {
  ANTHROPIC_API_KEY?: string;
  EXPLAIN_MODEL?: string;
}

interface Payload {
  fen: string;
  san: string;
  color: 'White' | 'Black';
  evalBefore: string;
  evalAfter: string;
  centipawnLoss: number;
  verdict: string;
  bestLine: string;
}

const SYSTEM =
  'You are a friendly chess coach explaining ONE move to an improving player. ' +
  'You are given the position (FEN), the move played (SAN), whose move it was, ' +
  'the engine evaluation before and after, the centipawn loss, a verdict, and ' +
  "the engine's best line. Explain in 2-3 plain-English sentences WHY the move " +
  'earned that verdict, using the numbers as ground truth. If a better move ' +
  'exists, name it from the best line. No markdown, no lists, no headers.';

function validate(b: unknown): Payload | null {
  if (!b || typeof b !== 'object') return null;
  const o = b as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === 'string' && v.length <= max ? v : null);
  const fen = str(o.fen, 120);
  const san = str(o.san, 12);
  const color = o.color === 'White' || o.color === 'Black' ? o.color : null;
  if (!fen || !san || !color) return null;
  return {
    fen,
    san,
    color,
    evalBefore: str(o.evalBefore, 12) || '?',
    evalAfter: str(o.evalAfter, 12) || '?',
    centipawnLoss: typeof o.centipawnLoss === 'number' && isFinite(o.centipawnLoss) ? o.centipawnLoss : 0,
    verdict: str(o.verdict, 24) || 'Move',
    bestLine: str(o.bestLine, 60) || '',
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const limited = rateLimit(context.request);
  if (limited) return limited;

  const key = context.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: 'coach_not_configured' }, { status: 503 });

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const p = validate(body);
  if (!p) return Response.json({ error: 'invalid_payload' }, { status: 400 });

  const model = context.env.EXPLAIN_MODEL || 'claude-sonnet-5';
  const userMsg =
    `Position (FEN): ${p.fen}\n` +
    `Move played: ${p.san} by ${p.color}\n` +
    `Eval before: ${p.evalBefore}   Eval after: ${p.evalAfter}\n` +
    `Centipawn loss for the mover: ${p.centipawnLoss}\n` +
    `Verdict: ${p.verdict}\n` +
    `Engine best line from before the move: ${p.bestLine || '(none)'}`;

  let res: Response;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 220,
        thinking: { type: 'disabled' },
        system: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });
  } catch {
    return Response.json({ error: 'upstream_unreachable' }, { status: 502 });
  }

  if (!res.ok) return Response.json({ error: 'upstream_error', status: res.status }, { status: 502 });

  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (data.content || [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text || '')
    .join('')
    .trim();

  return Response.json({ explanation: text || 'No explanation produced.' });
};
