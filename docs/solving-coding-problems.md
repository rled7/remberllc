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
