# NOVO portfolio demo

NOVO demonstrates a premium visual brand website, with the sneaker as its current subject. The format can be adapted to a high end perfume, premium property, fashion brand, creative portfolio, or premium service business.

- Project page: `/projects/novo`
- Standalone demonstration: `/demos/novo/`
- Editable source and detailed README: [`demo-src/novo/README.md`](../demo-src/novo/README.md)
- Served build: `public/demos/novo/`

The main techniques are layered parallax, scroll controlled transitions, mouse responsive depth, a visible cursor follower, a shared 3D product scene, and responsive layouts. The story's lines highlight at the viewport center; the three counters begin from zero as their number centers reach that point. Their current values describe the demo itself and can be replaced with verified brand statistics.

The project page provides an embedded preview and a full screen launch link. The standalone build keeps NOVO's React version, design system, and rendering code separate from the portfolio shell.

## Updating the experience

From this repository root, with Node 22.12 or later:

```sh
rtk npm run demo:novo:build
rtk npm run build
```

The first command installs the demo's pinned dependencies, builds its source, and replaces its generated public assets. Commit the source and refreshed public build together. The portfolio's usual build and Cloudflare deployment then serve the demo alongside the existing projects.

The asset optimizer is a development tool. It fetches the attributed original sample model if the local source cache is missing; the deployed page loads only the optimized, locally hosted model and fonts. Refer to the demo README and credits page for attribution.
