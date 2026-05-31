# Rember LLC Trucking — Content Buildout Spec (Opus supervisor → Sonnet worker)

The hub scaffold already builds + verifies (React+Vite+TS+react-router, Cloudflare Pages Function at functions/api/routes.ts). Your job: **replace placeholder copy with the real Rember LLC Trucking content** and make trucking the PRIMARY identity of the site. Dev portfolio stays secondary.

## DO NOT
- Do NOT run npm / build / wrangler / git (sub-agents are denied sandbox-off here — those calls fail). **Just write the files.** Opus verifies + commits.
- Do NOT change functions/api/routes.ts, lib/, vite.config.ts, tsconfig*, wrangler.toml, package.json, public/_redirects. The infra works — leave it.
- Do NOT add `import React from 'react'` to any component (react-jsx transform + noUnusedLocals will fail the build). Use named imports only (e.g. `import { useState } from 'react'`).
- Do NOT invent a DOT or MC number.

## Real business facts (use these verbatim where copy is needed)
- **Rember LLC Trucking** — a **carrier**, **owner-operated** (owns the truck).
- **Starts with one truck.** Frame this as a STRENGTH, not a limitation: owner-operated = direct accountability, personal communication, careful handling, no middle-man. Do NOT claim a fleet, terminals, or large capacity.
- **Hauls all freight types.**
- **Coverage: national** — **OTR (nationwide), regional, and local.**
- **Authority:** currently **operating under our partner carrier's authority** (leased on). Add a visible TODO + code comment for the 3PL partner name. NO fabricated DOT/MC numbers.
- **Contact:** email **rledesma@remberllc.com** (mailto:), phone **925-503-4248** (tel:+19255034248).
- **Business address:** the registered Rember LLC address — leave a clearly-marked placeholder + `{/* TODO: Rember LLC registered business address */}`.
- **Base/service state:** leave `{/* TODO: confirm specific base/service state */}` placeholder.
- **Tagline:** none given — use a sensible default like "Reliable freight, hauled with owner-operator care — nationwide." and mark it `{/* TODO: confirm tagline */}`.

## Pages to rewrite
- **src/pages/Hub.tsx** — the landing. LEAD with **Rember LLC Trucking** as the hero (name, tagline, a "Get a Quote / Contact" CTA → /contact, and a primary link into the trucking/business page). BELOW that, secondary quick-links: Portfolio (/portfolio), GitHub (github.com/rled7), Contact. Trucking is unmistakably the headline; the dev stuff is secondary.
- **src/pages/Business.tsx** — the full **Trucking** page: hero, About (carrier/owner-operated/all freight/national OTR+regional+local, the one-truck-as-strength framing), Services (freight types + coverage), Authority note (under partner carrier's authority + TODO), and a Contact CTA. Professional, trustworthy tone.
- **src/pages/Contact.tsx** — email (mailto), phone (tel), address placeholder (TODO), simple "Request a quote / reach out" framing.
- **src/pages/Portfolio.tsx** — keep as the secondary "Rene is also a software developer" section (Bridge Cost Optimizer → /projects/bridge live demo + GitHub; RAG Alpha Aggregator → github.com/rled7/rag-alpha-aggregator). Light touch; don't let it overshadow trucking.
- **src/components/NavBar.tsx** — nav: Home · Trucking (→/business) · Portfolio · Contact. (Rename the "Business" label to "Trucking".)
- **src/index.css** — make the theme read as a professional, trustworthy logistics/trucking business (clean, solid, industrial — strong neutral + one accent color). It can stay dark or go light; choose what looks most professional for a carrier. The Bridge demo page may keep a more technical look within /projects/bridge.

## Acceptance (Opus will verify these)
- All five routes still present; no `import React` lines; named imports only.
- Trucking is the clear primary identity on `/` and in nav; contact email/phone correct; all unknowns marked as visible TODO + code comments.
- Copy is honest (owner-operated, one truck, under partner authority — no fabricated fleet or DOT#).
- Will pass `npm run build` (tsc strict, noUnusedLocals) and render under `wrangler pages dev`.
