/// <reference types="@cloudflare/workers-types" />

import { getMockRoutes } from '../../lib/mock.js';
import { getLifiRoutes } from '../../lib/lifi.js';
import { normalize, rank } from '../../lib/costEngine.js';
import { keyFor, get as cacheGet, set as cacheSet } from '../../lib/cache.js';
import type { RouteQuery } from '../../lib/types.js';
import type { Chain } from '../../lib/types.js';

const VALID_CHAINS: Chain[] = ['ethereum', 'arbitrum', 'optimism', 'base', 'polygon', 'bsc'];

export const onRequestGet: PagesFunction<{ ADAPTER?: string }> = async (context) => {
  const url = new URL(context.request.url);
  const params = url.searchParams;

  const from = params.get('from') as Chain | null;
  const to = params.get('to') as Chain | null;
  const token = params.get('token');
  const amountStr = params.get('amount');

  // Validate
  if (!from || !VALID_CHAINS.includes(from)) {
    return Response.json({ error: 'Invalid or missing "from" chain' }, { status: 400 });
  }
  if (!to || !VALID_CHAINS.includes(to)) {
    return Response.json({ error: 'Invalid or missing "to" chain' }, { status: 400 });
  }
  if (from === to) {
    return Response.json({ error: '"from" and "to" chains must be different' }, { status: 400 });
  }
  if (!token) {
    return Response.json({ error: 'Missing "token" parameter' }, { status: 400 });
  }
  const amount = parseFloat(amountStr ?? '');
  if (!amountStr || isNaN(amount) || amount <= 0) {
    return Response.json({ error: '"amount" must be a positive number' }, { status: 400 });
  }

  const query: RouteQuery = { fromChain: from, toChain: to, token, amount };
  const adapter = context.env.ADAPTER ?? 'mock';

  // Check cache
  const cacheKey = keyFor(query);
  const cached = cacheGet(cacheKey);
  if (cached) {
    return Response.json({ query, routes: cached, count: cached.length });
  }

  // Fetch from adapter
  let rawRoutes;
  try {
    if (adapter === 'lifi') {
      rawRoutes = await getLifiRoutes(query);
    } else {
      rawRoutes = getMockRoutes(query);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Adapter error';
    return Response.json({ error: message }, { status: 502 });
  }

  // Normalize and rank
  const quotes = rank(rawRoutes.map((r) => normalize(r, query)));

  // Store in cache
  cacheSet(cacheKey, quotes);

  return Response.json({ query, routes: quotes, count: quotes.length });
};
