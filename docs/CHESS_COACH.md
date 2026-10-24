# Chess move explanations

The production API returned HTTP 503 with `coach_not_configured` on October 23, 2026. This means the Pages deployment did not provide `ANTHROPIC_API_KEY` to the explanation function.

The button now immediately displays a local engine summary: move, verdict at the current analysis depth, evaluation change, and a legal engine continuation converted from UCI to SAN. It then requests an optional AI explanation. If that request is unavailable, busy, empty, or takes more than eight seconds, the engine summary stays visible and accurately identifies its source. A new move or game cancels the pending request, preventing stale text from replacing the current move's explanation.

To enable the AI response, open Cloudflare **Workers & Pages → remberllc → Settings → Variables and Secrets**, add an encrypted `ANTHROPIC_API_KEY` for the appropriate environment, and redeploy. `EXPLAIN_MODEL` optionally overrides the model. Keep the secret server-side. A successful API response should contain a non-empty `explanation` string. The local engine summary works without the secret.
