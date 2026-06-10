/// <reference types="@cloudflare/workers-types" />

// Best-effort per-IP rate limiting for the public API routes. Cloudflare isolates
// are per-PoP and ephemeral, so this is a throttle that stops casual abuse, NOT a
// hard guarantee — pair with a Cloudflare WAF rate-limiting rule on /api/* for
// strong enforcement. In-memory map is bounded so it can't grow without limit.
const HITS = new Map<string, { count: number; reset: number }>();
const MAX_TRACKED = 10_000;

export function rateLimit(
  request: Request,
  { limit = 30, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): Response | null {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const now = Date.now();
  const rec = HITS.get(ip);

  if (!rec || now > rec.reset) {
    if (HITS.size > MAX_TRACKED) {
      for (const [k, v] of HITS) if (now > v.reset) HITS.delete(k);
    }
    HITS.set(ip, { count: 1, reset: now + windowMs });
    return null;
  }

  rec.count++;
  if (rec.count > limit) {
    const retry = Math.ceil((rec.reset - now) / 1000);
    return Response.json(
      { error: 'Rate limit exceeded — please slow down.' },
      { status: 429, headers: { 'Retry-After': String(retry) } },
    );
  }
  return null;
}
