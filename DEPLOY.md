# Deploying remberllc.com (Cloudflare Pages)

This site is a Cloudflare Pages app: a static React/Vite frontend (`dist/`) + Cloudflare **Pages Functions**
(`functions/api/routes.ts`) for the live bridge demo API. Same origin, no CORS. Your domain `remberllc.com`
is already on Cloudflare, so the custom-domain step is nearly one click.

## A. Connect the repo (one time)
1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize GitHub for **`rled7`** (one-time OAuth), then pick the **`remberllc`** repo.
3. **Build settings:**
   - Framework preset: **Vite** (or "None" — either works)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - Root directory: *(leave blank — repo root)*
4. (Optional) **Environment variables** → add `ADAPTER = mock` (keyless demo; the API defaults to mock anyway).
5. **Save and Deploy.** First build takes ~1–2 min. You'll get a `https://remberllc.<hash>.pages.dev` URL.

> Functions are auto-detected from `functions/`. `wrangler.toml` already sets `nodejs_compat`, so the API just works.

## B. Verify the preview URL
- `https://<preview>.pages.dev/` → the Rember LLC Trucking hub loads
- `/projects/bridge` → the live bridge demo
- `/api/routes?from=ethereum&to=arbitrum&token=USDC&amount=1000` → ranked JSON

## C. Point remberllc.com at it
1. In the Pages project → **Custom domains** → **Set up a custom domain** → enter **`remberllc.com`**.
2. Because the zone is already on Cloudflare, it **auto-creates the DNS record** (CNAME flattening handles the
   apex automatically) and provisions SSL. Repeat for **`www.remberllc.com`** if you want www → same site.
3. Wait for "Active" (usually a minute or two). Done — the site is live at https://remberllc.com.

> Note: the current Cloudflare holding-page A records (104.21.x / 172.67.x) get replaced automatically when you
> attach the custom domain to the Pages project. No manual DNS editing needed.

## D. Auto-deploys
Every `git push` to `master` triggers a new Cloudflare Pages build + deploy automatically. To update content,
just edit, commit, push.

## Future deploy notes
- Real LI.FI quotes: set the Pages env var `ADAPTER = lifi` (the adapter is wired and fixture-tested).
- If you later split the dev portfolio onto a subdomain (e.g. `portfolio.remberllc.com`), add it as another
  custom domain / Pages project — same account, no DNS hassle.
