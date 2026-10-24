# DSA Study Buddy portfolio demo

Public routes: `/projects/dsa` and `/demos/dsa/`.

The editable source in `demo-src/dsa` starts from the committed local app at `b0c300151ede12c6641185d2c8dbd28f0c4334d3`. The original repository and its uncommitted work remain untouched.

## Build

Run `npm run demo:dsa:build`, then `npm run build` at the portfolio root. The public build uses `.env.public`, and `scripts/sync-dsa.mjs` copies the generated files into `public/demos/dsa`. These compiled assets are committed, so a normal Pages build does not need to install the separate demo's dependencies.

JavaScript practice, curriculum, reference solutions, device-local progress, and solution downloads are available publicly. The Ollama chat/embedding service, C compiler endpoint, and direct GitHub export remain features of the local edition. The public UI requests no GitHub token and makes no localhost AI requests. Service worker registration is disabled in public mode; this edition does not promise offline availability.

## Execution and CSP

The page retains the portfolio's strict CSP. Each Run Tests action starts a disposable Web Worker. `/api/dsa-runner` serves only the hashed `practice.worker` bundle from this demo with a separate CSP permitting evaluation inside the worker and denying outgoing connections. Startup has a 12-second limit; submitted code gets 2.5 seconds after the worker is ready. Navigation cancels the active run. The worker has no DOM or localStorage access.

Test with `npm run pages:dev` after building. Vite alone does not run Pages Functions or production security headers.

Cloudflare reference: [Pages Functions static asset access](https://developers.cloudflare.com/pages/functions/api-reference/).
