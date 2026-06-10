/// <reference types="@cloudflare/workers-types" />

import { runPipeline, MAX_ITEMS } from '../../lib/ragAlpha.js';
import { rateLimit } from '../../lib/rateLimit.js';
import type { FeedItem } from '../../lib/ragAlpha.js';

// GET → run the 10-item demo feed (5 signals + 5 noise → 5 opportunities).
export const onRequestGet: PagesFunction = async () => {
  return Response.json({ opportunities: runPipeline() });
};

// POST { posts: {author?: string, text: string}[] } → classify custom feed items.
export const onRequestPost: PagesFunction = async (context) => {
  const limited = rateLimit(context.request);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Body must be valid JSON' }, { status: 400 });
  }

  const posts = (body as { posts?: unknown })?.posts;
  if (!Array.isArray(posts) || posts.length === 0) {
    return Response.json(
      { error: 'Body must include a non-empty "posts" array' },
      { status: 400 },
    );
  }

  // Validate: each post must have a string text.
  for (const p of posts) {
    if (typeof (p as { text?: unknown })?.text !== 'string') {
      return Response.json({ error: 'Each post must have a string "text" field' }, { status: 400 });
    }
  }

  const items: FeedItem[] = (posts as { author?: unknown; text: string }[])
    .slice(0, MAX_ITEMS)
    .map((p, i) => ({
      id: `post-${i}`,
      author: typeof p.author === 'string' && p.author ? p.author : '@anon',
      text: p.text,
    }));

  return Response.json({ opportunities: runPipeline(items) });
};
