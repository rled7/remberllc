# remberllc.com Personal Hub — Build Spec (Opus supervisor → Sonnet worker)

**Goal:** A single **Cloudflare Pages** site for `remberllc.com` — a Linktree-style personal hub with a
main business page, a portfolio, contact, AND the **Bridge Cost Optimizer as a live, working demo page**
backed by a Cloudflare **Pages Function**. One repo, one domain, no CORS (same-origin API).

**Owner:** Rene Ledesma. GitHub: github.com/rled7. (LinkedIn / X / email / resume = TODO placeholders — clearly marked.)

## Stack
React 18 + Vite 5 + TypeScript + `react-router-dom` (v6). Cloudflare Pages (static `dist`) + Pages Functions (`functions/`).

## HARD CONSTRAINTS (read carefully)
- `npm install`, `npm run build`, `npx tsc`, and `npx wrangler pages dev` ALL require **`dangerouslyDisableSandbox: true`** on the Bash call (npm registry + port binding blocked otherwise). Confirmed: `wrangler pages dev` works here with sandbox off.
- Write files with the **Write tool** (this dir is writable).
- The API is a **Pages Function**, NOT Express. Use raw `Request`/`Response` and the `env` binding.
- `ADAPTER` comes from the **Pages Function `env`** (`context.env.ADAPTER`), default `'mock'`. NEVER use `process.env`.
- Frontend calls the API at the **relative path `/api/routes`** (same origin — no CORS, no VITE_API_URL).
- Leave the in-memory `Map` cache in lib as-is. It is per-isolate; that's fine for a demo. **Do NOT add Cloudflare KV.**
- **Do NOT run git, create a GitHub repo, or deploy.** Opus reviews + pushes.

## Reuse (already copied into `lib/`)
`lib/{types,mock,lifi,costEngine,cache}.ts` are the portable pure logic from the bridge repo.
- **Fix their imports**: they currently import from `'../types.js'` — change to `'./types.js'` (files are flat in `lib/`).
- Port the bridge **frontend** UI from `/Users/user/Documents/PROJECTS/bridge-cost-optimizer/web/src/App.tsx`
  (290 lines: query form + ranked routes table + 3-layer fee breakdown + ETA + red `flagged` badge) into the
  Bridge demo page. Change its fetch URL to relative `/api/routes`.

## File layout to create
```
package.json            # react, react-dom, react-router-dom; dev: vite, @vitejs/plugin-react, typescript,
                        #   @types/react, @types/react-dom, @cloudflare/workers-types, wrangler
                        # scripts: dev(vite), build("tsc && vite build"), preview, "pages:dev":"wrangler pages dev dist --port 8788"
tsconfig.json           # bundler resolution, strict; types include @cloudflare/workers-types
tsconfig.node.json
vite.config.ts          # @vitejs/plugin-react
wrangler.toml           # name="remberllc", pages_build_output_dir="dist", compatibility_date (recent), compatibility_flags=["nodejs_compat"]
index.html              # Vite entry, <div id="root">, title "Rene Ledesma — Rember LLC"
public/_redirects       # SPA fallback:  /*  /index.html  200
functions/api/routes.ts # onRequestGet: parse from/to/token/amount; validate (bad/same chain, amount>0 -> 400);
                        #   pick adapter by env.ADAPTER (mock|lifi, default mock); cache->adapter->normalize->rank;
                        #   return Response JSON { query, routes, count }. Reuse lib/. Type as PagesFunction.
lib/  (fix imports as above)
src/
  main.tsx              # createRoot + <BrowserRouter><App/></BrowserRouter>
  App.tsx               # site shell: top nav (Home / Business / Portfolio / Contact) + <Routes>
  index.css             # clean, modern, responsive DARK theme; tasteful; mobile-friendly
  pages/
    Hub.tsx             # LINKTREE landing: name "Rene Ledesma", short tagline, avatar placeholder,
                        #   big tap-friendly link buttons: GitHub (https://github.com/rled7),
                        #   LinkedIn (TODO #), X (TODO #), Email (TODO), + nav cards to Business/Portfolio/Contact
    Business.tsx        # "Rember LLC" business page — placeholder mission/services/contact copy, clearly marked TODO
    Portfolio.tsx       # project cards:
                        #   - Bridge Cost Optimizer -> Link to /projects/bridge ("Live demo") + GitHub link
                        #   - RAG Alpha Aggregator -> GitHub https://github.com/rled7/rag-alpha-aggregator
                        #   - (1-2 placeholder cards)
    Contact.tsx         # contact section (email placeholder) + "Download resume" placeholder link
    BridgeDemo.tsx      # the ported, working bridge tool; fetch('/api/routes?...'); ranked table + fee breakdown + flag badge
  components/           # small shared bits as needed (NavBar, LinkButton, ProjectCard)
```
Routes: `/`=Hub, `/business`=Business, `/portfolio`=Portfolio, `/contact`=Contact, `/projects/bridge`=BridgeDemo.

## Design bar
Looks like a real personal site an employer would respect: cohesive dark theme, readable type, spacing,
hover states, responsive on mobile. Not flashy — clean and professional. Placeholder copy must be obviously
placeholder (e.g. "TODO: your LinkedIn URL") so Rene can fill it in.

## SELF-VERIFY before reporting done (sandbox OFF for install/build/dev)
1. `npm install` → `npx tsc --noEmit` clean.
2. `npm run build` → produces `dist/` with no TS errors.
3. `npx wrangler pages dev dist --port 8788 --ip 127.0.0.1 &` then:
   - `curl 'http://127.0.0.1:8788/api/routes?from=ethereum&to=arbitrum&token=USDC&amount=1000'` → ranked JSON, 4 routes, fee breakdown. PASTE this output.
   - `curl -s http://127.0.0.1:8788/ | head` → hub HTML loads.
   - kill the dev server.
4. Report: full file list, the curl JSON output, tsc/build results, and any deviations.

## Acceptance
tsc clean; vite build succeeds; `wrangler pages dev` serves the SPA AND `/api/routes` returns ranked routes
same-origin; all five routes render; placeholders clearly marked.
