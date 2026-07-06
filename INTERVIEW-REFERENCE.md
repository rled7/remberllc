# Interview Reference — Rene Ledesma's Portfolio Hub

> **Your cheat-sheet before any interview.** Pull this up on your phone. Every claim here is grounded in the actual source in this repo, *except* lines marked **[CONFIRM YOURSELF]** — those are about *your* reasoning or something I couldn't verify from disk. Read those, decide if they're true, and either own them or cut them. Never defend a claim you didn't write.

---

## 0. Logistics (read first)

- **The URL you give people:** `https://remberllc.pages.dev` — this is the dev portfolio, it's live and current.
- **⚠️ Do NOT hand out `remberllc.com`** — right now it serves a Cloudflare placeholder page, not your app. If an interviewer types `.com` it looks broken. Only give out `.pages.dev` until the custom domain is fixed.
- Repo: `github.com/rled7/remberllc`. Your GitHub: `github.com/rled7`.

---

## 1. The through-line (your 30-second "who am I as an engineer")

This is the most valuable thing in this doc. Interviewers remember a *narrative*, not six unrelated toys. Yours is real and it's consistent across every project:

> **"I build tools that run at the edge or fully client-side — no API keys to leak, deterministic and explainable outputs, and I verify them with real tests instead of trusting them. I care about the true cost of a system: tokens, gas, compute, whatever the unit is."**

The evidence for each clause:
- **Client-side / edge:** NexusScale and Strand run 100% in the browser; Bridge/Sybil/RAG/Chess run on Cloudflare Pages Functions (edge, not a server you babysit).
- **Keyless / no secrets to leak:** Sybil, RAG, Strand, NexusScale need *no* API key at all. The one place a key exists (Chess "Explain") is deliberately kept **server-side** so it never ships to the browser.
- **Explainable / deterministic:** Sybil "shows its work" per signal; the chess coach is *grounded in the engine's own eval numbers* so the LLM explains rather than hallucinates; RAG returns confidence + steps.
- **Cost-aware:** Bridge decomposes true cross-chain cost into 3 layers; Strand literally counts token savings; the chess `Explain` endpoint caps `max_tokens` and disables thinking because it's a high-volume, low-complexity call.
- **Verified, not trusted:** NexusScale's offline claim is checked by a real-browser smoke test; the chess puzzles are validated at build *and* runtime; the sybil/RAG demos ship with planted ground-truth data (5 sybils + 2 organics; 5 signals + 5 noise) so you can prove precision.

If you only memorize one paragraph, memorize that one.

---

## 2. Per-project deep dives

Each follows the same shape: **Pitch → Architecture → Key decisions → Drill-down Q&A → What I'd improve.**

---

### 🖼️ NexusScale — in-browser image & PDF upscaler
`/projects/nexus` · `github.com/rled7/nexus-scale`

**10-sec pitch:** "A 100%-in-browser image and PDF upscaler. Pick a multiplier or a 4K/8K target, and it enhances the image on-device — nothing is ever uploaded. The heavy pixel work runs in a Web Worker so the UI never freezes."

**Architecture (2-3 sentences):** React front-end; the resampling pipeline (bicubic resize + denoise/contrast/sharpen filters) runs off the main thread in a **Web Worker** and draws to a Canvas. PDFs are rendered to images with **pdf.js**, then run through the same pipeline. Zero network calls — it works with Wi-Fi off.

**Key decisions & tradeoffs:**
- **Web Worker, not main thread** — upscaling a large image to 8K is a multi-second CPU burn; on the main thread the tab would lock and the browser would show "page unresponsive." The worker keeps the UI at 60fps.
- **Honest scope:** this is **classical resampling (bicubic) + sharpening filters, NOT neural super-resolution.** Say this plainly if asked — it's the difference between "I enhance pixels with DSP" and "I hallucinate detail with a GAN." Overclaiming here is the fastest way to lose credibility. **[CONFIRM YOURSELF — is that the honest framing you want?]**

**Drill-down Q&A:**
- *"Why in-browser at all — isn't a server faster?"* → Privacy + zero infra cost. Nothing leaves the user's machine, so there's no upload wait, no storage bill, no data-handling liability. For a personal/utility tool that's the right tradeoff.
- *"How do you keep the UI responsive?"* → The pixel pipeline is in a Web Worker; the main thread only posts the source bitmap in and gets the result bitmap out. (Transferable objects avoid copying — **[CONFIRM YOURSELF whether you used `transfer` / `ImageBitmap`]**.)
- *"How do you know it actually works offline / hits 8K?"* → There's a real-browser smoke test. **[CONFIRM YOURSELF: does the test assert the output is genuinely 8K pixels, or just that the pipeline runs without error? Know which, because they'll ask.]**

**War story you can tell (this is gold):** "It had a *silent* crash on PDF upload — the page just froze with no error. Root cause: pdf.js spins up its own worker and posts messages back on the same channel, and a stray untagged message was being treated as a page-crash signal. I fixed it by **tagging our worker protocol** so we only handle our own messages, and I added a `BrowserLogger` that captures `window.onerror`, unhandled rejections, and worker errors — so the next silent failure isn't silent." This shows debugging methodology + "never ship blind" instinct. **[This is from your engineering log — confirm you remember the specifics well enough to tell it live.]**

**What I'd improve:** Offer an optional WebGPU / WASM super-resolution model for real detail synthesis; add tiled processing so 8K doesn't spike memory on low-end devices.

---

### 🧵 Strand — automatic conversation organizer
`/projects/strand` · `github.com/rled7/strand`

**10-sec pitch:** "It auto-organizes one long AI chat into labeled topic 'strands,' so you can pull up *everything about X* and feed the model only the relevant slice — cutting tokens without losing context. The wedge is that it's automatic, not manual folders."

**Architecture:** Pure, zero-dependency TypeScript. It **vectorizes each message as TF-IDF**, then does **online (incremental) clustering**: each new message joins the existing strand with the highest cosine similarity if that similarity ≥ a threshold, otherwise it starts a new strand. Strand labels are the top-3 highest-weight terms in the strand's centroid. Retrieval ranks strands by cosine of the query's TF-IDF vector against each strand centroid.

**Key decisions & tradeoffs:**
- **Online clustering vs batch k-means:** you don't know the number of topics up front, and messages arrive one at a time — so a threshold-based online assign-or-spawn fits the real usage (it also powers the "live route each message as you type" mode). No `k` to guess.
- **Assign to the *best* strand, not the previous one:** this is the clever bit. Because a message joins its most-similar strand anywhere in history, **an interleaved topic that resurfaces later rejoins its original strand** instead of fragmenting. That's the "conversations don't go in a straight line" insight.
- **Threshold = 0.05, tuned empirically.** Low-signal messages ("ok", "thanks", empty after stopword removal) attach to the current strand instead of spawning junk topics.

**Drill-down Q&A:**
- *"What distance metric?"* → **Cosine similarity** over TF-IDF vectors (sparse `Map<term, weight>`).
- *"Why is the threshold so low (0.05)?"* → Real threads have varied vocabulary, so same-topic messages often share only a few terms → modest cosine. Distinct topics sit near 0 and stay separate anyway. 0.05 grouped same-topic without over-merging on the test threads; it's a tunable knob (raise = stricter splits). **Be honest it's empirical, not learned.**
- *"How do you label a cluster?"* → Top-3 terms by weight in the running centroid — cheap and surprisingly readable.
- *"How real is the token-savings number?"* → It estimates ~4 chars/token (standard rough heuristic) and compares full-thread cost vs. average per-strand cost. **Say plainly: it's an estimate, swap in a real tokenizer (e.g. tiktoken) for production; the *relative* savings holds regardless.** Owning the approximation is more impressive than pretending it's exact.

**What I'd improve:** Real tokenizer for exact counts; embeddings (instead of TF-IDF) so it catches synonyms/paraphrase; a merge pass for near-duplicate strands.

---

### 🕵️ Sybil Detection Engine — explainable wallet-farm scoring
`/projects/sybil` · `github.com/rled7/sybil-detection-engine`

**10-sec pitch:** "Explainable sybil-wallet scoring for airdrop QA. Eight transparent signals score each wallet's risk, then union-find clustering surfaces coordinated farms. It's keyless and deterministic — every score shows its work."

**Architecture:** Cloudflare Pages Function (`/api/analyze`). `GET` runs 7 planted demo addresses (5 sybils + 2 organics); `POST` takes an `addresses[]` array, normalizes/dedups/caps them, and returns per-wallet reports + clusters. The scoring lives in a pure `lib/sybil` module.

**The eight signals (know these — this is what they'll ask):** wallet age, transaction count, shared funder, batch-funding timing, behavioral repetition, gas similarity, inter-wallet transfers, CEX funding. Each contributes to a risk band, and **each is shown**, so a reviewer sees *why* a wallet scored high — not a black-box number.

**Key decisions & tradeoffs:**
- **Explainability over a fancy model:** an airdrop team needs to *defend* a ban to the banned user. A transparent 8-signal rubric is defensible; a neural score isn't. This is a deliberate product choice, not a limitation. **[CONFIRM YOURSELF this was your reasoning.]**
- **Union-find (disjoint set) for clustering:** wallets funded by the same source / transferring to each other form connected components — union-find is the textbook, near-linear way to merge those into farms.
- **Deterministic + keyless:** same input → same output, no external API, so it's testable and shows its work.

**Drill-down Q&A:**
- *"Why union-find and not a graph library?"* → The operation is exactly "these two wallets are related → merge their groups," repeated. Union-find with path compression is near-O(1) amortized per union and dead simple — no dependency needed.
- *"How do you validate it?"* → The demo ships **ground truth**: 5 known sybils + 2 known organics. You can literally show precision/recall on load. **[CONFIRM YOURSELF whether you compute a metric or just show the labels.]**
- *"What's the false-positive risk?"* → Real answer: shared-funder and CEX-funding signals can flag legitimate users (e.g. everyone funded from the same exchange hot wallet). That's why it's a *risk band + explanation for a human reviewer*, not an auto-banner. Naming your own failure mode is a green flag in interviews.

**What I'd improve:** Weight the signals from labeled data instead of hand-tuning; add on-chain data ingestion (right now it's the demo dataset + your logic — **[CONFIRM the real data source]**).

---

### 🔎 RAG Alpha Aggregator — keyless local RAG classifier
`/projects/rag` · `github.com/rled7/rag-alpha-aggregator`

**10-sec pitch:** "A keyless, local RAG-style classifier that pulls airdrop opportunities out of noisy social feeds — bag-of-words cosine retrieval plus keyword rules rank each signal by confidence and return the steps to qualify. No API key required."

**Architecture:** Cloudflare Pages Function (`/api/opportunities`). `GET` runs a 10-item demo feed (5 signals + 5 noise → 5 opportunities); `POST` takes a `posts[]` array (each `{author?, text}`), caps at `MAX_ITEMS`, and runs the pipeline. Retrieval logic lives in `lib/ragAlpha`.

**Key decisions & tradeoffs:**
- **"RAG without a vector DB or an LLM":** be precise about what "RAG" means here — it's the *retrieval* half (bag-of-words / cosine ranking against known signal patterns), not generation. Calling it "RAG-style" and explaining the honest scope is stronger than letting them assume you ran embeddings + GPT.
- **Keyless:** cosine over bag-of-words needs no model API. Runs on the edge, costs nothing, deterministic.

**Drill-down Q&A:**
- *"Is this real RAG?"* → "It's the retrieval-and-rank core of RAG — bag-of-words cosine + keyword rules to score relevance and confidence. I didn't bolt on generation because the output is a ranked list with qualifying steps, not prose. Swapping the retriever for embeddings + a generator is the obvious upgrade path." (This answer wins because it's *honest and shows you know what full RAG is*.)
- *"How is confidence computed?"* → **[CONFIRM YOURSELF from `lib/ragAlpha` — is it the cosine score, a rule count, or a blend? Know the exact formula.]**

**What I'd improve:** Real embeddings for semantic match (catch paraphrased signals); a live feed ingestion instead of pasted posts.

---

### 🌉 Bridge Cost Optimizer — cross-chain route ranking
`/projects/bridge` · `github.com/rled7/bridge-cost-optimizer`

**10-sec pitch:** "Cross-chain bridge route ranking. It decomposes the *true* cost of moving tokens between chains into three layers — source gas, destination gas, protocol fee — and ranks routes by net capital preserved. It flags unreasonable fees as a QA signal."

**Architecture (this is your most backend-complete demo — lean on it):** Cloudflare Pages Function at `/api/routes`. `GET` with `from`, `to`, `token`, `amount`. The function does, in order:
1. **Rate limiting** (per-request).
2. **Input validation** — rejects invalid/missing chains, same source==dest, bad token format (regex + length cap), non-positive amount — each with a specific 400.
3. **Adapter selection** via `env.ADAPTER` (a **mock** adapter and a real **LI.FI** adapter behind one interface; defaults to `mock`).
4. **Per-isolate in-memory cache** (keyed on the query) to skip recompute.
5. **normalize → rank** cost engine, returns `{ query, routes, count }`.

**Key decisions & tradeoffs:**
- **Adapter pattern (mock | LI.FI):** the mock adapter makes the demo deterministic + free + always-up; the LI.FI adapter is real data. Same interface, switched by env. This is the "testable in CI, real in prod" pattern.
- **⚠️ The *live* demo runs the `mock` adapter by default** (that's why it always returns the same `across`/`hop` routes). **[CONFIRM YOURSELF: are you OK demoing mock data, or do you want to set `ADAPTER=lifi` in the Pages env for live quotes? Either is defensible, but *know which one is live* so you're not surprised.]**
- **Per-isolate cache, deliberately NOT KV:** for a demo, an in-memory `Map` per Worker isolate is the right call — no external state, no cost. You can explain *why you didn't* reach for Cloudflare KV (over-engineering for a demo; cache correctness across isolates doesn't matter here). Knowing when *not* to add infra is senior-signal.

**Drill-down Q&A:**
- *"Walk me through the request lifecycle."* → rate-limit → validate (specific 400s) → pick adapter by env → check cache → adapter fetch → normalize + rank → JSON. You can narrate this from memory; it's all in `functions/api/routes.ts`.
- *"Why decompose cost into three layers?"* → Because a headline "fee" hides that you pay gas on *both* chains plus a protocol cut. Ranking by net capital preserved is what a user actually cares about; the layered breakdown makes the ranking trustworthy.
- *"What's the `flagged` field?"* → A QA signal for unreasonable effective cost (bps) — surfaces routes that look like rip-offs.
- *"Why Express in the tags if it's a Cloudflare Function?"* → Original repo was Express; you **ported the pure cost logic into a Pages Function** (raw `Request`/`Response`, `env` binding) so it runs same-origin with no CORS and no server to run. That port *is* a talking point — it shows you can move logic across runtimes.

**What I'd improve:** Live LI.FI by default with a stale-while-revalidate cache; support more chains/tokens; historical fee trends.

---

### ♟️ Rember Chess — play & get coached
`/projects/chess` (also `/demos/chess`) · `github.com/rled7/rember-chess`

**10-sec pitch:** "A browser chess game where you play a real Stockfish engine at adjustable strength, solve a daily mate-in-one, and turn on coach mode — a live eval bar and per-move verdict computed locally, plus an on-demand 'Explain this move' that asks a model for a plain-English reason *grounded in the engine's own eval numbers.*"

**Architecture:** Vanilla JS front-end, `chess.js` for move legality, a **vendored single-threaded Stockfish WASM** engine for eval/best-move. The "Explain" feature is a Cloudflare Pages Function (`/api/explain`) that calls the Anthropic API **server-side** so the key never ships to the browser.

**Key decisions & tradeoffs (the WASM one is the best):**
- **Single-threaded WASM Stockfish, on purpose:** multi-threaded WASM needs `SharedArrayBuffer`, which needs COOP/COEP cross-origin-isolation headers — a deploy headache on static hosting. **You chose the single-threaded build so it runs client-side with zero special headers.** That's a real, specific infra tradeoff (a little weaker engine, dramatically simpler deploy) — exactly the kind of decision interviewers love.
- **LLM grounded in engine truth:** the `Explain` endpoint feeds the model the FEN, the move, eval-before, eval-after, centipawn loss, verdict, and the engine's best line, and the system prompt says *use the numbers as ground truth.* So the model **explains** the engine's assessment rather than **inventing** chess. This is the single best "how to use an LLM responsibly" story you have.
- **Cost posture (say this out loud, it's your cost-optimizer identity):** the explain endpoint uses **Sonnet, not Opus**, with **thinking disabled** and **`max_tokens` capped at 220** — because a move explanation is a short, high-volume, low-complexity call. Right-sizing the model to the task.
- **Graceful degradation:** no API key → the board still plays and the local eval bar still works; only "Explain" returns a 503. The product doesn't fall over when the optional AI part is unconfigured.

**Drill-down Q&A:**
- *"How do you stop the LLM from hallucinating chess?"* → It never evaluates the position itself — Stockfish does. The model only gets the engine's numbers and turns them into English. Ground truth in, explanation out.
- *"Why not multi-threaded Stockfish?"* → COOP/COEP header requirement for SharedArrayBuffer; single-threaded avoids it and deploys anywhere static. Deliberate simplicity-over-max-strength call.
- *"Is the key safe?"* → It's only ever on the server (Pages Function env). The browser calls *your* endpoint, not Anthropic. **[CONFIRM the `ANTHROPIC_API_KEY` is actually set in the Pages project — if it isn't, "Explain" returns `coach_not_configured` (503) live. Test it before you demo.]**
- *"How are puzzles trusted?"* → Validated at build *and* runtime, so a broken mate-in-one can't ship.

**What I'd improve:** Opening book / named openings; multi-move plans in the coach; persist the player's game history for progress tracking.

---

## 3. Pre-interview checklist (run this the morning of)

- [ ] Open `https://remberllc.pages.dev` on the device you'll screen-share — confirm it loads.
- [ ] Click each `Live demo` and confirm it works: Chess, Nexus, Strand, Sybil, RAG, Bridge.
- [ ] **Test chess "Explain this move" live** — if it 503s, the `ANTHROPIC_API_KEY` isn't set in the Pages env. Either set it or don't promise that feature.
- [ ] Decide bridge adapter: is the live demo `mock` or `lifi`? Know the answer before you're asked.
- [ ] Have `github.com/rled7` open in a tab in case they want to see code.
- [ ] Reread section 1 (the through-line). That's your opener when they say "tell me about your projects."
- [ ] **Never say `remberllc.com`** — say `remberllc.pages.dev`.

## 4. Honesty guardrails (things NOT to overclaim)

- NexusScale is **DSP resampling, not neural super-resolution.**
- RAG Alpha is the **retrieval half of RAG**, no generation/LLM in the pipeline.
- Strand uses **TF-IDF, not embeddings** — no semantic/synonym matching yet.
- Bridge live demo is likely **mock data** by default.
- Sybil/RAG demos run on **planted demo datasets**, not live on-chain/social feeds (**[CONFIRM]**).
- The token-savings counter in Strand is an **estimate (~4 chars/token)**, not an exact tokenizer.

Owning every one of these *raises* your credibility. The candidate who says "here's exactly where the simplification is" beats the one who gets caught pretending there isn't one.
