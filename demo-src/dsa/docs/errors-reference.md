# Errors Reference Page — Scoping Note

Working notes for a browsable "common errors" page (task: "scope errors-reference page").
Scoping only — nothing below is built yet. Same shape as `mobile-approaches.md` and
`multi-language-execution.md`: independent axes, a comparison table, open questions, no
code until a decision is made with the user.

## Why this isn't just another category in `reference.ts`

`reference.ts` catalogs a language's *API surface* — what `push()` or `reduce()` does. An
errors page catalogs *failure modes* — what goes wrong and why. The interesting version of
this isn't per-language (a `RefCategory` called "Errors" bolted onto each `LanguageRef`
would work mechanically, reusing `RefItem` as-is) but **cross-language, grouped by concept**:
an off-by-one bug is the same root cause in every language, but JS returns `undefined`
silently, Python raises `IndexError`, and C reads garbage memory or segfaults. Showing those
three side by side under one "Out-of-bounds access" entry is the actual lesson for a DSA
learner moving between languages — which is exactly the situation the new C runner just
created (see `multi-language-execution.md`). A per-language bolt-on would bury that
comparison across separate pages.

This also means it's a distinct data model from `RefItem`/`RefCategory`/`LanguageRef`, not
a reuse of them.

## Grounding: what the app already surfaces today

- **JS path** (`runner.ts`): `RunResult.compileError` for parse/definition failures (raw
  `Error.message`, e.g. `"x is not defined"`), `TestResult.error` per failing case (raw
  thrown-error message, e.g. `"Cannot read properties of undefined (reading 'length')"`).
  No pattern-matching or translation happens today — the raw JS engine message is shown
  as-is.
- **C path** (`server/cRunnerPlugin.ts`): `compileError` is raw `clang` stderr (multi-line,
  can include line numbers); per-case results carry raw `stderr` + `exitCode` from the
  child process (e.g. a segfault shows up as a nonzero/negative exit code and empty
  stdout, not a labeled "segmentation fault" message). This is rawer than the JS path —
  clang errors and bare exit codes are the least beginner-legible signal in the app today.
- Both paths are already funneled through the same `TestResult`/`RunResult` shape, per the
  open question already logged in `multi-language-execution.md` about whether that shape
  needs to grow to carry richer, multi-line/structured error info.

So there are two different problems bundled under "errors reference": (1) a proactive
catalog someone browses to learn, and (2) making the app's own raw failure output (already
being generated on every failed run) legible. They don't have to ship together.

## Axis A — Content model & scope

| Option | Shape | v1 content size | Notes |
|---|---|---|---|
| **Concept-first, cross-language** (recommended) | `ErrorConcept { id, name, summary, commonCause, fixHint, manifestations: [{ languageId, phase, signal, example? }], deepDiveId? }` — one entry per failure mode, with a per-language "how it actually shows up" row. `phase` = compile-time / runtime / logical. | ~12-15 concepts for v1 (index out-of-bounds, null/undefined dereference, stack overflow via infinite recursion, off-by-one loop bounds, type mismatch/coercion, integer overflow, uninitialized variable, use-after-free/double-free, mutating a collection while iterating it, reference vs. value confusion, floating-point equality, hash/equality mismatch on custom objects in a Set/Map, infinite loop). | Much smaller than the #41 reference-entries backlog (474 items) — this is a short, curated list of *patterns*, not one entry per possible exception class. |
| **Per-language bolt-on** | Reuse `RefItem`/`RefCategory` as-is, add an "Errors & Exceptions" category to each existing `LanguageRef` in `reference.ts`. | Same order of magnitude, ×however many languages. | Zero new data model or route — cheapest to ship, but loses the cross-language comparison, and duplicates the same concept N times (once per language) instead of once with N manifestations. |

**Scope decision needed:** which languages get `manifestations` in v1 — only JS + C (the
two the runner can actually execute and generate real errors for today), or all 12
languages already in `reference.ts` (purely educational, decoupled from what's actually
runnable)? Recommend starting with JS + C only, same reasoning as the runner's own build
order (smallest scope tied to what the app can actually exercise right now), adding
Python/Java/etc. manifestations as those runners land.

## Axis B — Discovery: standalone catalog vs. contextual surfacing

| Option | What it is | Effort | Notes |
|---|---|---|---|
| **Standalone browsable page** (recommended for v1) | New route (`#/errors`, `#/errors/:conceptId`), new sidebar entry, list + detail view — structurally identical to `renderReferenceList`/`renderReferenceDetail` in `main.ts`. Someone reads it proactively, like the reference or concepts pages. | Low — same shape as existing infra, no runtime hook-up needed. | Ships independently of any runner changes. |
| **Contextual surfacing** | When a real run fails, pattern-match the raw `compileError`/`TestResult.error` string against known signals and show an inline "explain this" link into the matching catalog entry, right under the failed test. | Higher — needs a matcher (regex/heuristics per language) against messy raw compiler/runtime text, plus wiring into the run-results renderer. | The higher-value half long-term (turns today's raw clang stderr into something a beginner can act on), but a distinct, separable effort from the catalog itself — mirrors how `deepDiveId` is an optional enhancement bolted onto `RefItem` rather than a prerequisite for it. |

**Recommendation:** ship the standalone catalog first (Axis B option 1), with contextual
matching as an explicit, separately-scoped follow-on — not a v1 blocker. This mirrors the
existing `deepDiveId?` pattern: the catalog entry can exist and be useful before anything
auto-links to it from a failed run.

## Sketch of the data model (not yet built)

```ts
export type ErrorPhase = "compile-time" | "runtime" | "logical";

export interface LanguageManifestation {
  languageId: string;   // matches LanguageRef.id in reference.ts
  phase: ErrorPhase;     // when *this* language actually catches it, if at all
  signal: string;        // what you literally see: exception name / message shape / exit behavior
  example?: string;      // minimal snippet that triggers it in this language
}

export interface ErrorConcept {
  id: string;
  name: string;              // language-neutral failure mode, e.g. "Index out of bounds"
  summary: string;           // plain-English: what's actually happening
  commonCause: string;       // the DSA-relevant root cause (off-by-one, missing base case, etc.)
  fixHint: string;
  manifestations: LanguageManifestation[];
  deepDiveId?: string;       // reuses the existing referenceDeepDives.ts infra
}
```

## Not yet researched / open questions

- Whether `phase` should also cover a C-specific "undefined behavior, may not fail at all"
  case distinctly from a hard crash — off-by-one C errors often silently corrupt memory
  without any visible symptom, which is a different (arguably scarier) lesson than a clean
  segfault.
- Where this lives in the sidebar relative to "Language & Framework Reference" and
  "Concepts" — a peer section, or nested under Reference.
- Whether contextual matching (Axis B option 2) is worth building at all before Assembly/
  Java runners land, since C is currently the only language with genuinely raw/unfriendly
  error output; JS's native messages are already fairly legible on their own.

**Decision:** none yet — this is scoping only. Pick a v1 concept list + Axis A/B choice
with the user before writing any code.
