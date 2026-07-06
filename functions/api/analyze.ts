/// <reference types="@cloudflare/workers-types" />

import { analyze, DEMO_ADDRESSES } from '../../lib/sybil.js';
import { rateLimit } from '../../lib/rateLimit.js';

// GET → analyze the 7 planted demo addresses (5 sybils + 2 organics).
// Makes the curl smoke-test and the page-on-load auto-run trivial.
export const onRequestGet: PagesFunction = async () => {
  return Response.json(analyze(DEMO_ADDRESSES));
};

// POST { addresses: string[] } → explainable sybil reports + clusters.
export const onRequestPost: PagesFunction = async (context) => {
  const limited = rateLimit(context.request);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Body must be valid JSON' }, { status: 400 });
  }

  const addresses = (body as { addresses?: unknown })?.addresses;
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return Response.json(
      { error: 'Body must include a non-empty "addresses" array' },
      { status: 400 },
    );
  }
  if (!addresses.every((a) => typeof a === 'string')) {
    return Response.json({ error: 'All addresses must be strings' }, { status: 400 });
  }

  // analyze() normalizes (trim/dedup) and caps at MAX_ADDRESSES internally.
  return Response.json(analyze(addresses as string[]));
};
