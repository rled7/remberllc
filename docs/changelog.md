# remberllc — Change Tracker & Build Log

> A plain-English record of every change to the website, so you can see **what
> changed and when** without scouring commits on GitHub. **Newest build on top.**
>
> **Current build:** `Build 0009` — 2026-06-02
> **Live:** every push to `master` auto-deploys to Cloudflare Pages (`remberllc.pages.dev`).

## How to use / how the build number works
- **Build number** = a simple counter that goes up by 1 every time the site
  meaningfully changes (a feature, fix, copy, or config change you'd deploy).
  It is *not* tied to a single commit — one build can bundle a few related
  commits. The newest build is always at the top, and its number is mirrored in
  **Current build** above.
- **To add a build:** copy the template below to the top of the list, increment
  the number, fill in the date + summary + commit sha(s).
- This file opens directly in **Word, Pages, or Google Docs** (File → Open),
  or reads cleanly as text / on GitHub.

```
## Build 00XX — YYYY-MM-DD — <one-line summary>
**Commit(s):** `sha`
- what changed, in plain English
- why (the bug or goal)
```

---

## Build 0009 — 2026-06-02 — Hero responsiveness: hide scroll hint on short screens + dvh
**Commit(s):** `79d2bca`
- **"Hide what cannot fit":** on viewports `≤ 620px` tall, the decorative "Scroll"
  hint is now hidden (`display: none`) instead of crowding the content above it —
  the preferred follow-up to Build 0008's space-reservation fix.
- Switched the hero from `100vh` → **`100dvh`** so it measures the *visible*
  viewport (fixes mobile browsers overcounting the height behind the address bar).
- Files: `src/index.css` (`.hero` min-height; new `@media (max-height: 620px)`).
  See problem log `docs/solving-coding-problems.md` #002.

## Build 0008 — 2026-06-02 — Fix: hero "Scroll" hint overlapping the trust stats
**Commit(s):** `5887b41`
- **Bug:** on the home hero, the bottom "Scroll" indicator overlapped the row of
  trust stats just above it on shorter/laptop screens.
- **Cause:** the hint is pinned to the hero's bottom while the hero content is
  vertically centered — on short viewports the centered content grew down into
  the hint.
- **Fix:** added `padding-bottom: 88px` to `.hero` in `src/index.css` to reserve
  space for the hint so the content can never overlap it. Verified the build.

## Build 0007 — 2026-06-01 — RAG Alpha live demo + Sybil demo fix
**Commit(s):** `7ffb78f`
- Added the **RAG Alpha aggregator** live demo at `/projects/rag` (returns ranked
  airdrop opportunities).
- Fixed an issue on the Sybil demo page that shipped in the prior build.

## Build 0006 — 2026-06-01 — Sybil detection live demo
**Commit(s):** `8360597`
- Added the **Sybil detection** live demo at `/projects/sybil` — wallet scoring
  across transparent signals, shown in the portfolio.

## Build 0005 — 2026-06-01 — Docs: Solving Coding Problems playbook + this tracker
**Commit(s):** `87ff120`, `0532c9a`
- Added `docs/solving-coding-problems.md` — the first-stop running playbook for
  any coding problem (problem / expected / actual / attempts / solution).
- Created this change tracker (`docs/changelog.md`). Removed `docs/bugfixes.md`
  (folded into the playbook).

## Build 0004 — 2026-06-01 — Fix: home nav-cards overlap + hero polish
**Commit(s):** `4538a9b`, `55e2250`
- **Bug fix:** the three home "Explore" nav-cards (Trucking / Software / Contact)
  overlapped and fragmented, worst at ≤880px. Cause: `.nav-card` was an inline
  `<a>` with block children. Fix: `display: flex; flex-direction: column;` on
  `.nav-card`.
- Minor hero polish along the way: `.hero` z-index, reduced padding/margin,
  `.scroll-hint` z-index + `pointer-events: none`. Verified live.

## Build 0003 — 2026-06-01 — Full modern redesign + pages UI
**Commit(s):** `0c4bed8`
- **Modern tech light redesign** (the current look): warm paper "studiotech"
  theme, Space Grotesk + Inter + Bricolage fonts, fluid type, scroll-reveal
  motion, numbered section eyebrows, dark "dev zone" for the portfolio.
- Pages rewritten: `Hub.tsx` (hero + trust strip), `Business.tsx`,
  `Portfolio.tsx`, `Contact.tsx`, `BridgeDemo.tsx`, `NavBar.tsx`, `App.tsx`.
- Content: phone → 925-503-3814, LinkedIn = linkedin.com/in/rene-ledesma,
  résumé installed at `public/resume.pdf`.

## Build 0002 — 2026-05-31 — Cloudflare Pages deploy setup
**Commit(s):** `8057d67`, `c94358d`, `bc8e985`, `42209a3`
- Wired up the Cloudflare Pages deploy: pages assets directory config, removed
  stale wrangler files, fixed `package.json` corruption, pinned Vite for the
  Cloudflare build, deploy credentials.

## Build 0001 — 2026-05-31 — Initial site + portfolio hub
**Commit(s):** `9272bb1`, `cc7f857`, `8e21e1b`
- **First build:** remberllc.com — Rember LLC Trucking site + portfolio hub +
  live bridge demo on Cloudflare Pages. Follow-ups: removed an API, small fix.
