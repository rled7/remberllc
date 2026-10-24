# NOVO — parallax and scroll controlled brand experience

A premium sneaker concept with dark surfaces, bold Barlow Condensed typography, an acid lime accent, and a real 3D sneaker. The source prototype is in `/Users/user/CHATGPT/novo`. The intended showcase is a portfolio project and live demonstration on **remberllc.pages.dev**.

## Parallax and scroll controlled transitions

The experience demonstrates how foreground content and slower background layers create depth. Scrolling controls the main 3D poses, feature transitions, paired sneaker/background color changes, and the center timed brand story. Three numbers count up as they reach the viewport center. Mouse response and interaction states complement the scroll sequence.

Depth also spans the page through three persistent visual planes. On desktop, mouse movement shifts the near, middle, and far planes by different amounts, gives the sneaker a gentle additional tilt, and drives a visible accent ring that follows the cursor. Scroll and pointer transforms use separate wrappers so the effects combine smoothly. Touch and reduced motion presentations keep the same content without requiring a mouse.

Interaction reference: [Squarespace Browser History's Renaissance artwork](https://www.awwwards.com/inspiration/squarespace-browser-history-campaign-renaissance-style-artwork) and its [creator case study](https://www.awwwards.com/case-study-browser-history-2020-by-squarespace.html). The inspiration is the relationship between layered depth, movement through a scene, and mouse response. NOVO uses its own styling and the attributed sneaker asset.

Additional reference: [Missing — WebGL 3D Parallax Effect](https://www.awwwards.com/inspiration/webgl-3d-parallax-effect-missing), supplied by the user for pointer responsive spatial depth.

The product and visual language can be adapted for a high end perfume, premium property, fashion brand, creative portfolio, or premium service business. Swap the model or imagery, palette, copy, metrics, and primary action while preserving the motion and layout framework. The purpose is to give a visual brand a distinctive presentation and a clear next step.

## Run locally

```sh
rtk npm install
rtk npm run dev
```

Open <http://127.0.0.1:5173>. The server binds to the local machine. For a production build, run `rtk npm run build`; use `rtk npm run preview` to preview it locally.

## Page sequence

1. Full viewport hero: floating sneaker, slow rotation, gentle bobbing, a two-line headline with an accent word, CTA, and a pulsing scroll indicator.
2. Adaptive Sole technology: text on the left, product on the right, and a reveal from the left.
3. Precision Weight Distribution: reversed composition with a reveal from the right.
4. Breathable Mesh Construction: centered heading and product composition with a rising, scaling reveal.
5. Full screen color journey: Chalk, Volt, Ember, and Glacier change the sneaker and background together.
6. Brand story: each line lights up at the viewport center, then softens as it passes. The same sneaker continues alongside it, gently rotating and cycling through colors.
7. Animated statistics: three labeled counters start at zero when their centers cross the viewport center, each with an accent underline. The current figures describe this demo itself.
8. Bold CTA: the background light responds to mouse movement.
9. Minimal footer with the NOVO logo, three navigation columns, copyright, credits, and a back-to-top link.

The sticky navigation has four smooth scroll links and a subtle blurred glass treatment after scrolling. Content entrance animations are scoped through `data-reveal`. The feature backgrounds counteract part of the document's movement so they move more slowly than foreground content.

## Implementation map

| File | Purpose |
| --- | --- |
| `src/content.ts` | Feature copy, four color palettes, statistics, and shared scene state. |
| `src/App.tsx` | Semantic page sections, navigation, colorway controls, and CTA. |
| `src/motion.ts` | Viewport reveals, parallax, scroll-to-scene mapping, counters, and pointer response. |
| `src/SneakerScene.tsx` | One Three.js canvas, model loading, lighting, surface colors, and rendering lifecycle. |
| `src/styles.css` | Design tokens, section layouts, responsive rules, and reduced motion presentation. |
| `public/credits.html` | Asset attribution and concept context. |

## Smoothness and accessibility

- One render loop controls the sneaker. Rotation and bobbing use elapsed time.
- Per-frame scene changes use mutable scene state, avoiding React renders on each frame.
- Geometry and textures load once per mounted scene; color changes reuse the same model and shader uniforms.
- Shader compilation happens before the loaded scene is shown.
- Rendering resolution is capped at 1.75 device pixels per CSS pixel on desktop and 1.25 on narrow screens.
- Rendering pauses after the closing CTA boundary or when the document is hidden.
- The Glacier-to-story handoff interpolates position, scale, rotation, and the strength of automatic color cycling in both scroll directions.
- Scroll positions map directly to scene poses; background parallax uses transforms with direct scrubbing.
- Reduced motion mode removes entrance movement and idle animation, presents readable story content and final statistics, and shows all four colorway labels together.
- Keyboard navigation, a skip link, descriptive labels, and visible focus states are included.

Frame timing must be checked on the target device; a local browser measurement cannot guarantee identical performance on every device. The renderer exposes bounded frame samples at `window.__novo.frameTimes` to support checks.

## Content and assets

NOVO is an illustrative brand concept. The feature descriptions are concept copy. Statistics default to three feature perspectives, four colorways, and one continuous 3D experience; replace those with sourced metrics for a real brand.

The sneaker is **Materials Variants Shoe**, © 2021 Shopify, from [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MaterialsVariantsShoe), under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The material colors and lighting are modified for this concept; the original preview provides a fallback. The original sample is approximately 7.8 MB. `rtk npm run optimize:assets` removes unused baked color variants and resizes retained surface maps to at most 1024px. The original is kept outside the served directory in `assets-source/`; measured sizes are recorded in `assets-source/optimization.json`.

Dependencies are pinned in `package-lock.json`. Fonts are bundled locally. This is a static frontend demonstration; checkout and backend services are not connected. Hosting is managed by the parent portfolio.

## Portfolio integration

The portfolio project page is `/projects/novo`; the standalone experience is `/demos/novo/`. The Rember repository keeps the editable source in `demo-src/novo/` and a built copy in `public/demos/novo/`, following its existing standalone demo pattern. From the portfolio repository root, run `rtk npm run demo:novo:build` to install the demo's pinned dependencies, rebuild it, and refresh that built copy. The normal portfolio build then includes the static demo assets.

The demonstration has been checked in a visible Chromium browser with forward and reverse scrolling, pointer interaction, center timing, five live resize widths from 320px to 1440px, iPhone touch emulation, reduced motion, and a model loading failure. Physical device performance remains a separate check. Asset optimization reduced the served model from 7,833,592 bytes to 3,076,916 bytes (60.7%).

The reusable planning reference is [3D_SCROLL_ANIMATION_WEBSITE.md](../3D_SCROLL_ANIMATION_WEBSITE.md).
