# Rember LLC websites and portfolio

One Cloudflare Pages deployment serves the software portfolio on `remberllc.pages.dev` and the trucking business on `remberllc.com` when its custom domain is connected. The separate travel website, `sindestino.com`, belongs to its own project.

## Development

Run `npm ci`, `npm run dev`, and open the preview with `?site=dev` or `?site=business`. Run `npm run build` for the production assets, then `npm run pages:dev` to test Pages Functions and security headers locally.

## Interactive portfolio

- **NOVO:** `/projects/novo` and `/demos/novo/`. A premium brand concept with layered parallax, scroll controlled 3D transitions, pointer depth, four synchronized colorways, a center-timed story, animated counters, and a closing CTA. See [the motion explanation](docs/NOVO.md), [editable source](demo-src/novo/README.md), and [validation notes](docs/NOVO_VALIDATION.md).
- **DSA Study Buddy:** `/projects/dsa` and `/demos/dsa/`. Browser JavaScript exercises, reference solutions, device-local progress, system design references, and solution downloads. See [public demo details](docs/DSA_STUDY_BUDDY.md).
- **Portfolio background:** ray-marched 3D smoke changes color with scrolling, then blends into two depths of Matrix-style rain at the demo grid. See [implementation and fallbacks](docs/PORTFOLIO_BACKGROUND.md).
- **Chess coaching:** the Explain button gives an immediate engine summary and optionally retrieves AI coaching. See [configuration and the diagnosed backend issue](docs/CHESS_COACH.md).

The portrait is self-hosted at `public/profile.jpg`. The public résumé is the exact `Software_Engineering_Resume_10_16_26.pdf`, served at `/resume.pdf` with a versioned link and revalidation headers.

Normal builds use the committed demo assets. After editing a demo, run `npm run demo:novo:build` or `npm run demo:dsa:build` before the main build. Demo source builds have separate lockfiles and do not change the portfolio's React dependency.

See [deployment](DEPLOY.md) and [trucking-domain setup](docs/DOMAIN_SETUP.md).
