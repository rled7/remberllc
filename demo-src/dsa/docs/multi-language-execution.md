# Multi-Language Execution Note

**Status update (2026-07-14):** Step 1 of the suggested build order below is now
implemented and verified — C via local toolchain (Axis A/B: local-only, clang). See
`server/cRunnerPlugin.ts` (dev-only `/api/run-c` endpoint), `src/runners/cTypes.ts` +
`cCaseRenderer.ts` (declarative signature → generated case bodies, generic across
problems) + `cRunner.ts` (client-side runner calling the endpoint), and `cSignature`
fields added to 34 problems in `curriculum.ts`. Verified end-to-end: real C compiled
with clang and executed against the live endpoint for all 34 cSignature problems,
using the app's actual `compareToExpected` (not a reimplementation), plus a negative
control (deliberately wrong solution) confirming the harness discriminates rather than
rubber-stamping. The IDE UI is also wired up: a Language selector (JavaScript/C) appears
on any problem with a `cSignature`, switching languages swaps in that language's starter
code, Run tests calls the C path asynchronously against `/api/run-c` and renders
PASS/FAIL results the same way as JS, and the public-deployment case (no dev endpoint
reachable) surfaces as an in-UI message rather than a silent failure. "Show solution" is
disabled while C is selected, since reference solutions are JS-only. Verified in a real
headless-Chrome session (CDP): language switch, correct-solution PASS, wrong-solution
FAIL, and compile-error paths all render correctly end-to-end through the actual UI, not
just the backend. Solved-code export (`saveSolutionCode`) is intentionally JS-only for
now — that store backs the GitHub export feature, which assumes a `.js` file extension
(see `export.ts`); a C pass still marks the problem solved but doesn't feed export.
Steps 2–4 (Assembly, Java, WASM) remain unstarted. The rest of this document is the
original scoping note, left as-is for the reasoning behind the build order.

Working notes for extending the runner (`src/runner.ts`) beyond JavaScript to C, C++,
Java, and Assembly. Scoping only — nothing below is built yet. Two independent axes,
kept separate on purpose, same shape as `mobile-approaches.md`: **how the code actually
gets compiled/run** (Axis A, differs per language) and **whether it can work for a public
visitor to the deployed site, or only locally for the user** (Axis B — this app already
has a precedent for that split).

## Why this isn't a small extension of the existing runner

`runTests()` today evaluates JS with `new Function(...)` — the browser's own JS engine
*is* the execution environment, so there's nothing to install or host. That trick doesn't
generalize: a browser has no C compiler, no JVM, no assembler built in. Every other
language needs either (a) a real toolchain running somewhere and a way to reach it, or
(b) that toolchain itself ported to run inside the browser (WASM). There's no third
option that keeps the current zero-infrastructure model.

The app is also a **static Cloudflare Pages deployment** (confirmed via `wrangler.toml` /
existing deploy, see `web-projects-to-extract` history) — there is no server component to
shell out from today. Any option that needs a real compiler running server-side is a new
piece of infrastructure, not a config change.

## Existing precedent worth reusing: the Ollama split

The v2/v3 buddy+brain features already solved a structurally identical problem: they call
`http://localhost:11434` directly from browser JS. That works when *the user* is running
the app locally (or even the deployed site, in their own browser, with Ollama running on
their own Mac) but silently can't work for an unrelated visitor to the public deployment,
who has no local Ollama. The app already accepts that split rather than requiring a
hosted LLM backend. The same pattern is the natural fit here.

## Axis A — per-language execution mechanism

| Language | Local-toolchain option | In-browser (WASM) option | Notes |
|---|---|---|---|
| **C / C++** | Shell out to `gcc`/`g++`/`clang`. **Already present on this machine** — `/usr/bin/gcc`, `/usr/bin/g++` (Apple clang 21, via Xcode CLT). | **TinyCC (tcc) compiled to WASM**, or a WASM-clang playground build. tcc is the realistic one: small, fast, compiles a useful C subset, several existing WASM ports to adapt rather than build from scratch. Real clang-to-WASM exists (compiler-explorer-style) but is a much heavier lift. | Cheapest real option overall — the local toolchain already exists on this Mac. |
| **Java** | Shell out to `javac` + `java`. `javac` binary exists at `/usr/bin/javac` but **no JRE is currently installed** — needs `brew install openjdk` (or similar) before this works at all. | **CheerpJ** (actively maintained WASM JVM, free tier). Doesn't include `javac` itself, but since `javac` is itself a Java program, it can run *inside* CheerpJ's own JVM once OpenJDK's `javac.jar` is bundled — real, but a heavier integration than it sounds (large download, non-trivial setup). | Local option needs one `brew install` first; in-browser option is the most engineering-heavy row in this table. |
| **Assembly** | Shell out to `as`/`ld` (present: `/usr/bin/as`) or `nasm` (**not installed**). Real x86-64/ARM assembly, but "assembly" isn't one ISA — whichever real target is picked, only that target's syntax is supported. | A **toy/custom ISA assembler + emulator written directly in TypeScript** (no WASM, no download) — the standard approach other browser assembly-teaching tools use (e.g. MARS/Ripes-style simulators, or lighter single-page ones). Not "real" hardware assembly, but pedagogically standard and by far the lightest to build. | Only language where the *in-browser* option is cheaper than the local-toolchain one, precisely because "real" assembly forces an ISA choice the local option doesn't dodge either. |

**Reading:** C/C++ is the easy win (toolchain already on the machine). Java needs one
install (`brew install openjdk`) before the local path works at all. Assembly is the one
row where a from-scratch toy interpreter is probably the *better* answer, not just the
cheaper one — a custom minimal ISA sidesteps the "which real assembly" question entirely
and matches what similar teaching tools already do.

## Axis B — local-only vs. public

- **Local-only (recommended default, mirrors Ollama)**: a tiny local dev endpoint (Vite
  dev-server middleware, or a small standalone Node process) that shells out to the real
  toolchains above. Works for the user, on this machine, today (once the one Java install
  is done). On the public Cloudflare Pages deployment, the language tab shows a clear
  "requires running locally" message instead of silently failing — same UX contract the
  buddy/brain panels already use.
- **Hosted judge API** (Judge0, Piston, Sphere Engine, etc.) — sends code to a third-party
  sandboxed execution service over HTTPS from the client. Would actually work for public
  visitors too, not just the user. Explicitly **not recommended as a default**: introduces
  a network dependency and (for anything beyond a low-volume public demo tier) an API
  key/cost to manage, and hands untrusted user-submitted code to a third-party execution
  service — a different trust model than everything else in this app, which runs
  everything client-side. Worth revisiting only if "works for random visitors" becomes an
  actual goal, not a nice-to-have.
- **In-browser WASM toolchains** — the "real public support, zero server, zero third
  party" answer, at the cost of the heaviest build effort (see Axis A). This is the
  option that would eventually let C/C++/Java run for any visitor with no local
  toolchain, no hosted judge, and no new trust boundary — the direction to grow into
  later if it's ever worth the effort, not the v1.

## Suggested build order, if/when this gets picked up

1. **C/C++ via local toolchain** — toolchain already installed, smallest new-code surface
   (a dev-only endpoint + a runner variant that shells out and parses stdout/stderr into
   the existing `TestResult` shape).
2. **Assembly via a custom toy ISA in TypeScript** — no install dependency at all, and
   arguably the best pedagogical fit for a DSA study tool (registers/stack/jumps taught
   directly, no real-ISA baggage).
3. **Java via local toolchain** — same shape as C/C++, gated on doing the one JRE install
   first.
4. **WASM in-browser versions** of any of the above — separate, larger effort, only if
   "works for a public visitor with no local setup" becomes a real goal later.

## Not yet researched / open questions

- Exact shape of the "local dev endpoint" — Vite middleware vs. a tiny separate Node
  process the user runs alongside `npm run dev`. Both work; not yet decided.
- Sandboxing the shelled-out process even locally (timeouts, memory caps, no filesystem/
  network access from submitted code) — needs real design, not an afterthought, same
  reasoning as the crash-visibility and cost-guardrail standards already applied
  elsewhere in this workspace.
- Whether the existing `TestResult`/`RunResult` shape in `runner.ts` needs to change to
  carry compiler stderr (not just a single `compileError` string) for languages where
  compile errors are multi-line and line-numbered.

**Decision:** none yet — this is scoping only (task item: "Scope multi-language IDE
execution"). Pick a starting language + build order with the user before writing any code.
