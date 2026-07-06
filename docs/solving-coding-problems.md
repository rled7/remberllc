# Solving Coding Problems — Running Playbook

> **This is the FIRST document to check whenever we hit a coding problem.**
> It is a running log of every problem that took an extended time to solve.
> Before debugging something new, skim here — we may have already seen it (or
> something close) and written down the cause, the dead-ends, and the fix.

## How to use this document
1. **Hit a hard/slow problem?** → search this file first (symptom keywords).
2. **Spent extended time on something?** → it gets an entry here, no exceptions.
3. **Log it while it's fresh**, including the attempts that *didn't* work — the
   dead-ends are often the most valuable part for next time.
4. Two valid outcomes, both worth logging:
   - ✅ **SOLVED** — root cause found and fixed.
   - 🩹 **WORKAROUND** — root cause *not* fully solved, but a workaround
     unblocked the project. Say so honestly and note what's still open.

## Entry template (copy for each new problem)

```
## NNN — <short title>
**Date:** YYYY-MM-DD | **Status:** SOLVED / WORKAROUND | **Area:** <file/feature> | **Commit:** <sha>

### Problem
<what is going wrong, in one or two sentences>

### Expected
<what we expected to see / the correct behavior>

### Actual
<what we actually saw — be concrete; include exact symptoms>

### Context / environment
<where it happens: page, viewport, OS, tool versions, build vs dev, etc.>

### Attempts (including what did NOT work)
1. <attempt> → <result / why it failed or misled us>
2. ...

### Root cause
<the real underlying reason — or "NOT fully determined" if a workaround>

### Solution / Workaround
<the change that fixed it (SOLVED) — or the workaround that unblocked us
(WORKAROUND), plus what remains open>

### Verification
<how we confirmed it's actually fixed / live>

### Prevention / lesson
<how to avoid this class of problem next time>
```

---

## Index
| # | Date | Title | Status |
|---|------|-------|--------|
| 001 | 2026-06-01 | Home nav-cards overlap vertically | ✅ SOLVED |
| 002 | 2026-06-02 | Hero "Scroll" hint overlaps the trust-stats row | ✅ SOLVED |
| 003 | 2026-06-02 | Gemini research agent halts mid-run — session turns exhausted | 🩹 WORKAROUND |
| 004 | 2026-07-06 | Sybil wallet-age shows ~56 years live, correct locally | ✅ SOLVED |

---

## 004 — Sybil wallet-age shows ~56 years live, correct locally
**Date:** 2026-07-06 | **Status:** ✅ SOLVED | **Area:** `lib/sybil.ts` (module-scope clock) | **Commit:** `cc7bff5`

### Problem
The Sybil Detection demo's planted "new" wallets showed wallet age **~56.5
years** in production, while local dev consistently showed the correct
**~7.0 days**.

### Expected
Sybil wallets should read ~7 days old (`isNew = true`, +15 risk points);
organic wallets ~730 / ~400 days old.

### Actual
Live `/api/analyze` returned `wallet_age_new` value **"20647.8 days"** for a
wallet that should be 7 days old. Organics showed proportionally inflated
values too (21370.8, 21040.8 days) — the same **relative deltas** (730, 400
days) between wallets, but with a constant ~20640-day offset added to all of
them.

### Context / environment
Cloudflare Pages Function (`functions/api/analyze.ts` → `lib/sybil.ts`),
**production only**; `wrangler pages dev` locally always showed correct
values, which is exactly what made this look like a stale-deploy issue rather
than a code bug.

### Attempts (including what did NOT work)
1. Assumed live was serving a stale build — the sybil fix commit `0c4bed8`
   had sat on `origin/master` since 2026-06-01, over a month, unreleased.
   Pushed a **docs-only** commit and polled live: saw no change, and
   **wrongly concluded "auto-deploy is broken."** This was an invalid test —
   a docs-only commit can't change the build output either way, so the poll
   could never have disproven the theory. (User caught this reasoning error.)
2. Added a `_buildMarker` field baked directly into the `/api/analyze` JSON
   response, pushed, confirmed it appeared live → **proved auto-deploy DOES
   work**, invalidating the stale-deploy theory entirely, while the age bug
   persisted.
3. Checked response headers for edge caching (`cache-control: no-store`) →
   ruled out caching as the cause.
4. Added a temporary `_debugClock()` diagnostic returning raw values
   (`moduleScopeNOW`, `requestTimeNowSec`, `sybilBase`, `sybil0FirstTxTs`),
   pushed, curled live → got hard numbers instead of guessing further.

### Root cause
`lib/sybil.ts` had `const NOW = Math.floor(Date.now() / 1000)` at **module top
level**. Cloudflare Workers evaluate top-level module code once at cold start
under a **frozen/non-live clock** (`Date.now()` returns `0` there — a
Spectre-style timing-attack mitigation); real wall-clock time is only
available once execution is inside a request handler. Confirmed with live
data: `moduleScopeNOW: 0`, `requestTimeNowSec: 1783362345` (a normal current
timestamp), `sybilBase: -604800` (= `0 - 7*86400`) — proving the broken `NOW`
propagated straight through. Local `wrangler pages dev` (under Node) never
freezes the clock, so it always looked correct there — an accurate-looking
local test that was actually testing the wrong runtime's behavior.

### Solution / Workaround
✅ **SOLVED.** Moved all "now" computation to request time: fixtures
(`buildFixtures(now)`) and the `synthesize()` fallback now take `now` as a
parameter, threaded from `analyze()`'s existing per-request `nowTs` (computed
inside a function body, which Workers evaluate live) — the same pattern
already correctly used for scoring. Removed the module-level
`NOW`/`SYBIL_BASE` constants entirely. Cleaned up the temporary
`_buildMarker`/`_debugClock` diagnostics once confirmed fixed.

### Verification
- Local `wrangler pages dev`: sybil wallets → 7.0 days, organics → 730.0 /
  400.0 days (clean response, no debug fields).
- **Live** `https://remberllc.pages.dev/api/analyze` post-deploy: sybil
  wallets → 7.0 days, organics → 730.0 / 400.0 days, debug fields absent.
  Confirmed via direct curl, not inferred.

### Prevention / lesson
- **Never compute `Date.now()` (or anything time-sensitive) at module top
  level in a Cloudflare Worker / Pages Function** — it runs once at cold
  start under a frozen clock. Always compute inside a function body
  (request-time), and thread the value down as a parameter to anything that
  needs it (fixtures, synthesizers, etc.).
- **Local `wrangler dev` does not reproduce this cold-start clock freeze** —
  a passing local test here is not proof of correctness in production. When
  "local is right, live is wrong" for anything clock/time/random/crypto
  related, suspect a runtime-environment difference before a stale deploy.
- **A check is not verification unless it could have failed.** The
  docs-only-commit test in attempt #1 looked like due diligence but
  structurally could not distinguish "auto-deploy works" from "auto-deploy is
  broken," since nothing in that commit could change the build output.
  (Escalated separately into the `feedback-verify-before-claiming` memory.)

---

## 001 — Home nav-cards overlap vertically
**Date:** 2026-06-01 | **Status:** ✅ SOLVED | **Area:** `src/index.css` `.nav-card` (Hub home page) | **Commit:** `4538a9b`

### Problem
On the home page's bottom **"Explore"** section, the three nav-cards
(Trucking / Software / Contact) rendered **on top of one another** — card boxes
overlapping with text appearing between them ("buttons one on top of another
with the words in between").

### Expected
Three distinct, non-overlapping cards: side-by-side on desktop, cleanly stacked
in a single column on narrow screens — each card a solid box fully wrapping its
number, title, description, and "Enter →".

### Actual
The white card backgrounds **fragmented** and **overlapped** vertically. The
number ("01"), title, description, and "Enter →" scattered into separate broken
boxes that collided with the next card. Most obvious at viewport width
**≤ 880px** (where cards stack to one column), but the broken box model existed
at every width.

### Context / environment
- Page: `/` (`src/pages/Hub.tsx`), the `.nav-cards` "Explore" section.
- Viewport: worst ≤ 880px (the `@media (max-width:880px)` rule sets
  `.nav-cards { grid-template-columns: 1fr }`). Visible on desktop too if the
  window is < ~880px wide.
- Stack: Vite + React + react-router. macOS. Reproduced on dev server and the
  deployed Cloudflare Pages site.

### Attempts (including what did NOT work)
1. **Read the Contact-page CSS looking for a broken button** → dead end. The
   reported "buttons near contact" were not on `/contact`; that page has a
   single, correct "Email us" button. *Lesson: pin the exact location first.*
2. **Static headless screenshots at "390px"** → **misleading.** Headless Chrome
   floors the window width at **~500px**, so a 390px shot is a *crop* of a 500px
   render. This produced a false "horizontal overflow" diagnosis (content looked
   clipped on the right). It was a screenshot artifact, not a real bug.
3. **`--force-device-scale-factor=2` with a 750px window** to fake a 375px
   viewport → **did not work.** DSF changes pixel density, not CSS layout width;
   `clientWidth` stayed 750.
4. **Injected a runtime overflow-detector script** (list elements wider than the
   viewport) → confirmed **zero** overflow at 500px. Useful: it *disproved* the
   overflow theory and redirected the hunt.
5. **Compared deployed vs local via git** → ruled out a stale deploy: local
   `master` == `origin/master`; only an unrelated hero-spacing change was
   uncommitted. So the bug was in shared code, not a version mismatch.
6. **Forced `.reveal { opacity:1 }` while keeping `transform: translateY(26px)`,
   stacked at 760px** → finally **reproduced** the overlap on screen.
7. **Then forced `transform:none` (rest state) at 760px** → still broken →
   proved the overlap was *not* caused by the scroll-reveal animation but by the
   card's own box model.

### Root cause
`.nav-card` is rendered as an `<a>` (`<Link>`). Its CSS set `position`,
`background`, `border`, `padding`, etc. but **never set a `display` value**, so
it defaulted to `display: inline`. The anchor contains **block-level** children
(`<div class="nav-card-title">`, `<div class="nav-card-desc">`). An inline
element cannot properly contain block-level descendants — the browser fragments
the inline box, the background/border paint only around the inline pieces, the
block children escape the card, and adjacent cards overlap.

The sibling `.proj-card` was correct (`display: flex; flex-direction: column`);
`.nav-card` was simply missing it. The reveal `transform: translateY(26px)`
(larger than the `18px` grid gap) made the overlap more visible during scroll
but was a symptom, not the cause.

**Offending CSS** (note: no `display`):
```css
.nav-card {
  position: relative;        /* inline <a>, no display set */
  background: var(--bg-surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 30px 28px 26px;
  text-decoration: none;
  color: var(--ink);
  overflow: hidden;
  transition: transform var(--t), box-shadow var(--t), border-color var(--t);
}
```
**Offending markup** (`src/pages/Hub.tsx`) — inline `<a>` wrapping block `<div>`s:
```tsx
<Link to={c.to} className="nav-card">
  <span className="num">{c.num}</span>
  <div className="nav-card-title">{c.title}</div>   {/* block child */}
  <div className="nav-card-desc">{c.desc}</div>      {/* block child */}
  <span className="go">Enter &rarr;</span>
</Link>
```

### Solution / Workaround
✅ **SOLVED.** Add two lines to `.nav-card` so the anchor is a real block
container that fully wraps its children (matching `.proj-card`):
```css
.nav-card {
  display: flex;            /* added */
  flex-direction: column;  /* added */
  position: relative;
  /* ...rest unchanged... */
}
```

### Verification
- Re-rendered the stacked layout at 760px → clean, non-overlapping card boxes.
- `npm run build` passed.
- Confirmed the **live** Cloudflare bundle (`index-BkUKZOMy.css`) contains
  `.nav-card{display:flex;flex-direction:column;...}` after deploy.

### Prevention / lesson
- Any "card" element (background + border + padding) that wraps block-level
  children **must** declare `display: flex`/`block`/`grid` — never rely on the
  default `inline` for `<a>`/`<span>` containers.
- **Debugging UI with headless screenshots:** Chrome floors width at ~500px, and
  scroll-reveal (`opacity:0` until in view) hides below-fold content in static
  shots. To see the true layout: force `.reveal { opacity:1 }`, collapse any
  `min-height:100vh` hero, and screenshot — or you'll chase artifacts.

---

## 002 — Hero "Scroll" hint overlaps the trust-stats row
**Date:** 2026-06-02 | **Status:** ✅ SOLVED | **Area:** `src/index.css` `.hero` / `.scroll-hint` (Hub hero) | **Commit:** `5887b41` | **Site build:** `Build 0008`

### Problem
On the home hero, the decorative **"Scroll" ↓ hint** at the bottom of the screen
**overlapped the row of trust stats** ("the scroll overlaps with the words
immediately above it") on shorter / laptop-height screens.

### Expected
The "Scroll" hint sits cleanly at the bottom of the hero with clear space below
the trust-stats row — no text/elements touching or overlapping at any viewport
height.

### Actual
The "Scroll" label + its animated dot rendered **on top of the trust-stats row**
(the `01 truck / nationwide / etc.` block), the two visually colliding. Worst on
**short viewport heights** (laptops, or a browser window that isn't full-height);
fine on tall screens.

### Context / environment
- Page: `/` (`src/pages/Hub.tsx`) — the `.hero` section; offending pair is
  `.hero` (container) + `.scroll-hint` (the hint), styled in `src/index.css`.
- **Site build at fix:** `Build 0008` · commit `5887b41`. The hero was introduced
  in `Build 0003` (redesign, `0c4bed8`); `.scroll-hint` got `z-index` +
  `pointer-events:none` back in `Build 0004` (`4538a9b`) — related history.
- **Toolchain / software build numbers:**
  - Vite `^5.4.2` (built with **v5.4.21**) · `@vitejs/plugin-react ^4.3.1`
  - React `^18.3.1` · react-dom `^18.3.1` · react-router-dom `^6.26.0`
  - TypeScript `^5.5.3` · **Node v22.22.3** · macOS (Darwin x86_64)
  - Host: Cloudflare Pages (`remberllc.pages.dev`), auto-deploy on push to `master`.
- Trigger condition: viewport **height** small enough that the centered hero
  content reaches the bottom-pinned hint (roughly when usable hero height ≲ the
  content height + the hint's ~72px footprint).

### Attempts (including what did NOT work)
1. **Initial instinct: "push the hint down" (lower its `bottom`)** → **wrong lever.**
   The hint is already pinned to the bottom; lowering `bottom` shoves it toward
   the screen edge (risking clipping) and does **nothing** to stop the *centered
   content* from expanding down into it. It would mask the symptom on one screen
   size and reappear on another.
2. **Inspected the DOM/CSS to find the true relationship** → found the real cause
   (below): it's a layout-model collision, not a spacing typo.

### Root cause
Two layout systems fighting over the same bottom strip:
- `.hero` is `display: flex; align-items: center; min-height: calc(100vh - 68px)`
  → its content (`.hero-inner`: headline → lead → CTA → **trust-row**) is
  **vertically centered**.
- `.scroll-hint` is a sibling with `position: absolute; bottom: 22px` → **pinned
  to the hero's bottom**, out of normal flow.

On a short viewport the centered content block is nearly as tall as the hero, so
its **bottom edge (the trust-row) grows down into the bottom ~22–72px zone** where
the absolute hint lives. Nothing reserved space for the hint, so they overlap. It
is height-dependent, which is why tall screens looked fine.

**Relevant CSS (before):**
```css
.hero {
  position: relative;
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: center;   /* content centered… */
  overflow: hidden;
}
.scroll-hint {
  position: absolute;
  bottom: 22px;          /* …but hint pinned to bottom → they collide */
  /* ~72px tall incl. label + 30px dot */
}
```

### Solution / Workaround
✅ **SOLVED in `Build 0008` (`5887b41`).** Reserve space at the hero's bottom so
the centered content can never reach the pinned hint — one line:
```css
.hero {
  /* …unchanged… */
  padding-bottom: 88px;  /* reserve the .scroll-hint footprint (bottom:22px + ~50px tall) */
}
```
Because the hint is positioned relative to the hero's padding box, it stays put,
while the centered content is pushed up off the reserved strip — robust at any
viewport height.

**Preferred direction going forward — "hide what cannot fit" (not yet shipped):**
The cleaner philosophy for a *decorative* element (`.scroll-hint` is
`aria-hidden` + `pointer-events:none`) is to **drop it when there's no room**,
rather than always reserve space. Candidate for a future `Build 0009`:
```css
@media (max-height: 620px) {
  .scroll-hint { display: none; }   /* hide what cannot fit */
}
.hero { min-height: calc(100dvh - 68px); }  /* dvh = visible area; fixes mobile address-bar overcount */
```
This pairs well with the reserve fix (reserve on normal screens, hide on tiny
ones). Ask before shipping — `Build 0008` already resolves the reported bug.

### Verification
- `npm run build` (`tsc && vite build`, Vite v5.4.21) passed clean — CSS bundle
  regenerated (`dist/assets/index-BHA6WozS.css`, 21.99 kB).
- Committed `5887b41`, pushed to `origin/master` → Cloudflare Pages auto-deploy.
  *(Visual confirmation on the live short-viewport render still recommended.)*

### Prevention / lesson
- When a **vertically-centered** content block (`align-items:center`) shares a
  viewport-height container with an **absolutely bottom-pinned** element, expect a
  collision on short viewports. Fix by **reserving space** (`padding-bottom`) or,
  for decorative elements, **hiding them when they can't fit** (`@media
  (max-height: …)`). **Do not** just move the pinned element — that chases the
  symptom across screen sizes.
- Prefer `100dvh` over `100vh` for full-height heroes — `vh` overcounts on mobile
  (counts the area behind the address bar), which makes "doesn't fit" bugs worse.

---

## 003 — Gemini research agent halts mid-run — session turns exhausted
**Date:** 2026-06-02 | **Status:** 🩹 WORKAROUND | **Area:** `~/.gemini/settings.json` (`maxSessionTurns`) — Gemini CLI token-research swarm | **Commit:** n/a (local tool config, not in repo)

> **Not a `remberllc` site bug** — this is a tooling/infra problem with the
> Gemini CLI research swarm (token-optimizer research, `~/gemini_research_workspace`).
> Logged here per the "every extended-time problem gets an entry" rule, and
> because it is **causally linked to a still-open fabrication problem** (see the
> "Related / still open" section — read it before re-running the swarm).

### Problem
A long-running **Gemini CLI** research agent stopped **mid-research**: it
"consumed all of that session's turns" and terminated before finishing its
search/triage pass, leaving the research run incomplete.

### Expected
The agent keeps searching/fetching and triaging sources until the research task
is actually done — a turn/tool-call budget should not cut it off partway.

### Actual
The session hit a **turn ceiling** and ended early. Every agent step — including
**each tool call (web search / fetch)** — counts as one "turn," so a
search-heavy run burns turns fast and trips the cap well before the topic is
exhausted. Net effect: partial research, then a hard stop.

### Context / environment
- Tool: **Gemini CLI `0.44.1`** (`/Users/user/.nvm/versions/node/v22.22.3/bin/gemini`),
  **Node v22.22.3**, macOS (Darwin 25.5.0).
- Auth: `oauth-personal` (`~/.gemini/settings.json` → `security.auth.selectedType`).
- Workload: the token-optimizer research swarm under `~/gemini_research_workspace`
  (governed by `RESEARCH-PROTOCOL.md` / `SWARM-PROTOCOL.md`), which is
  fetch-heavy by design (grounded retrieval = many tool calls per source).

### Attempts (including what did NOT work)
1. **Grepped for an explicit numeric tool-call / search cap** in
   `SWARM-PROTOCOL.md`, `RESEARCH-PROTOCOL.md`, and all 7 files in
   `~/Documents/PROJECTS/_research-briefs/` → **none found.** The protocols cap
   *quality gates*, not turn/tool-call counts. Dead end — the limit is not in the
   research instructions.
2. **Inspected `~/.gemini/settings.json`** → it only contained the `security.auth`
   block; **`maxSessionTurns` was not set**, so the build's default was in force.
   *Misleading note:* Gemini CLI docs describe the `maxSessionTurns` default as
   `-1` (unlimited) — yet the agent still ran out, so either this build ships a
   finite default or the early stop came from a different mechanism. Not fully
   pinned down (see Root cause).
3. **Confirmed with the user** that the symptom was specifically "ran out of the
   session's turns" → identified `maxSessionTurns` as the correct lever.

### Root cause
Gemini CLI enforces a **per-session turn budget via `maxSessionTurns`**, and it
counts **every agent step (each tool call included)** against that budget. A
retrieval-grounded research run makes many tool calls per source, so it exhausts
the budget and the CLI terminates the session mid-task.
**NOT fully determined:** whether this build's *default* `maxSessionTurns` is
finite (contradicting the documented `-1`) or whether a separate quota/limit
contributed — hence WORKAROUND, not SOLVED. The fix below removes the ceiling
regardless of which of those was true.

### Solution / Workaround
🩹 **WORKAROUND** — explicitly remove the turn ceiling. Added one key to
`~/.gemini/settings.json`:
```json
{
  "security": { "auth": { "selectedType": "oauth-personal" } },
  "maxSessionTurns": -1
}
```
`-1` = unlimited turns, so the agent runs until the task completes instead of
being cut off. Reversible (delete the one line). **Requires restarting the
`gemini` session** — settings are read at launch.
Why "workaround," not "solved": it lifts the cap rather than explaining why the
documented-unlimited default didn't apply, and — more importantly — an unbounded
turn budget on a swarm that is **currently fabricating** (below) means it can now
fabricate *more*, not less. Unblocking and root-fixing are different things here.

### Verification
- `python3 -c "import json; ..."` → file parses as valid JSON, `maxSessionTurns == -1`.
- Behavioral confirmation (agent now runs to completion without an early turn
  stop) is **pending the next `gemini` run** — not yet observed.

### Prevention / lesson
- For long, autonomous, retrieval-heavy agent runs, set the turn/step budget
  **deliberately** (`maxSessionTurns: -1` or a high explicit number) up front —
  the default is a silent mid-run guillotine for fetch-heavy work.
- **But never lift a budget cap on an *ungrounded* swarm.** A turn cap is a weak
  accidental backstop against runaway fabrication; removing it only helps if the
  grounding + per-batch validator gates in `RESEARCH-PROTOCOL.md` are actually
  enforced. Pair "unlimited turns" with "mandatory fetch + validate," or you
  scale the wrong thing.

### Related / still open — ⚠️ READ BEFORE RE-RUNNING THE SWARM
The same swarm **re-triggered the original 25k fabrication problem.** The shared
URL registry `~/gemini_research_workspace/covered-urls.txt` holds **49,997
entries** — implausibly high vs. what was actually fetched, and ~the same scale
as the **49,225** fabricated entries from the first incident
(`token-research-25k-spec` memory). Control-validated forensics this session
(bogus IDs correctly return "Article not found", so the checker works):
- Five domains are each padded to ~10,000 entries: `scribd.com` (10,047),
  `dspace.mit.edu` (9,998), `dash.harvard.edu` (9,974), `arxiv.org` (9,960),
  `jstor.org` (9,923) — together ~49,900 of 49,997.
- **scribd:** every URL is `/document/<random>/Research-Paper` (identical slug) →
  template-generated. **dspace/dash:** bare `handle/<7-digit>` IDs, but real
  DSpace/DASH handles require a `1721.1/` / `1/` prefix → invalid → fabricated.
- **arXiv `2601–2606` band (~9,930): NOT future-dated** (Jan–Jun 2026 are real
  months — today is 2026-06-02; that's *why* they slipped past a naive future
  check). They are **valid-format RANDOM IDs**: a fixed random sample resolved
  **only ~5/30 (~17%)**, the rest return "Article not found"; the few that
  resolve are off-topic collisions (spin glasses, chest X-rays), not findings.
- **jstor (~9,923): topically implausible + UNVERIFIED.** 10k JSTOR
  (humanities/social-science archive) hits on an LLM-inference topic is absurd
  and shares the batch signature, but JSTOR is unreachable from the sandbox, so
  fabrication is strongly suspected, not proven.
- **9,971 of 9,982 `mini-*.md` files were created in the SAME MINUTE**
  (`2026-06-02 18:10`) → machine batch-dump, not research. They cite the same
  synthetic URLs.
- **Prose evaded last incident's tell:** analysis paragraphs are now **100%
  unique** (49,858 distinct), vs. incident #1's 81 paragraphs reused 49k times.
  The swarm now confabulates a *unique* analysis per *fake* URL — defeating both
  byte-dedup AND prose-dedup. *Lesson: dedup ≠ authenticity, and "the prose is
  all unique" ≠ real. The only ground truth is: does the URL resolve to a real,
  ON-TOPIC page?*
- **Ledger is ordered genuine-first, fabricated-appended:** head = real on-topic
  sources (anthropic launch, artificialanalysis, real arXiv like `2402.11131`
  SampleAttention / `2407.11550` Ada-KV); tail = the synthetic block.

Genuine core ≈ **~150 candidate entries pending per-URL verification** (NOT
confirmed real — some non-mega entries also look synthetic, e.g.
`artificialanalysis.ai/models/deepseek-v4-pro/value-report`). The discriminator
is **resolves + on-topic**, scattered across both band and non-band arXiv.

This fabrication is **NOT fixed.** The authoritative REAL corpus lives in
`~/.claude/jobs/01585db7/` (122 mini-batches, 134 unique URLs, syntheses) — the
gemini workspace is the *fabrication* workspace and is likely wholesale
disposable. Cleanup decision (user 2026-06-02): **hard delete**, but only after
"diagnose more first" — so the keep-set must be pinned (or the workspace
confirmed redundant vs. the job dir) BEFORE deleting. Removing the turn cap (this
entry's fix) without fixing the fabrication lets the swarm generate fiction
faster — so re-running the swarm is gated on enforcing the
`RESEARCH-PROTOCOL.md` fetch+validate gates.
