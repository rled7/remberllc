/// <reference types="@cloudflare/workers-types" />

interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }

// Eval is allowed only inside this disposable Web Worker, never in the page.
// Pages Functions set their own response headers, independent of _headers.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const asset = url.searchParams.get('asset') || '';
  if (!/^\/demos\/dsa\/assets\/practice\.worker-[A-Za-z0-9_-]+\.js$/.test(asset)) {
    return new Response('Invalid worker asset', { status: 400 });
  }
  const response = await env.ASSETS.fetch(new Request(new URL(asset, url.origin)));
  if (!response.ok || !response.headers.get('Content-Type')?.includes('javascript')) {
    return new Response('Worker not found', { status: 404 });
  }
  return new Response(response.body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; script-src 'self' 'unsafe-eval'; connect-src 'none'",
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
