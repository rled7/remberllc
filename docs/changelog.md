# remberllc — Change Tracker

> Timestamped record of every change made to the website, so we can always look
> back and find when/where something happened. Newest entries on top.
> **Deploy:** every push to `master` auto-deploys to Cloudflare Pages
> (`remberllc.pages.dev`). Times are local.

## How to use
- Add an entry **each time the site changes** (feature, fix, copy, config).
- Format: `### YYYY-MM-DD HH:MM — <summary>` then bullets of what changed, with
  the commit sha. Group multiple commits under the same heading if related.

---

### 2026-06-01 09:49 — Docs: Solving Coding Problems playbook · `87ff120`
- Added `docs/solving-coding-problems.md` — the first-stop running playbook for
  any coding problem (problem/expected/actual/attempts/solution-or-workaround).
- Removed `docs/bugfixes.md` (folded into the new playbook).

### 2026-06-01 09:43–09:46 — Fix: home nav-cards overlap · `4538a9b`, `55e2250`
- **Bug fix:** the three home-page "Explore" nav-cards (Trucking / Software /
  Contact) overlapped/fragmented, worst at ≤880px. Cause: `.nav-card` was an
  inline `<a>` with block children. Fix: added `display: flex; flex-direction:
  column;` to `.nav-card` in `src/index.css`.
- Minor hero polish that rode along: `.hero` z-index, reduced hero padding/margin,
  `.scroll-hint` z-index + `pointer-events: none`.
- Logged the bug in `docs/bugfixes.md` (`55e2250`, later merged into the
  playbook). Verified live on Cloudflare.

### 2026-06-01 00:27 — Full redesign + pages UI updates · `0c4bed8`
- **Modern tech light redesign** (the current look). Light "studiotech" theme
  (warm paper), Space Grotesk + Inter + Bricolage fonts, fluid type, scroll-reveal
  motion, numbered section eyebrows, dark "dev zone" for the portfolio.
- Pages rewritten: `Hub.tsx` (hero + trust strip), `Business.tsx` (editorial +
  CTA band), `Portfolio.tsx` (dev zone, profile card, Résumé/LinkedIn/GitHub),
  `Contact.tsx`, `BridgeDemo.tsx` (browser frame), `NavBar.tsx` (scroll-aware),
  `App.tsx` (dynamic footer year).
- Content: phone → 925-503-3814, LinkedIn = linkedin.com/in/rene-ledesma,
  résumé installed at `public/resume.pdf`.

### 2026-05-31 19:12–20:00 — Cloudflare Pages deploy setup · `8057d67`–`42209a3`
- `42209a3` Restore wrangler pages assets directory config.
- `bc8e985` Remove wrangler config files.
- `c94358d` Fix package.json corruption and pin Vite for the Cloudflare build.
- `8057d67` Pages deploy credentials.

### 2026-05-31 18:07–19:02 — Initial site + portfolio hub · `9272bb1`, `cc7f857`, `8e21e1b`
- `9272bb1` **Initial build:** remberllc.com — Rember LLC Trucking site +
  portfolio hub + live bridge demo (Cloudflare Pages).
- `cc7f857` API removed. · `8e21e1b` follow-up fix.
