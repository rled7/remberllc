# Portfolio smoke and Matrix background

`src/components/PortfolioBackdrop.tsx` renders a decorative WebGL volume behind the software portfolio. A ray marches through an animated 3D density field. Pointer movement shifts the camera, and both pointer and scroll movement displace nearby wisps farther than distant cloud banks. Foreground light is brighter; distant layers fade into cooler haze. Page scroll interpolates blue, violet, cyan, green, and purple lighting.

At the selected-work grid, the volume blends into two depths of Matrix-style glyph rain. The blend reverses when scrolling back to the hero and fades when leaving the grid. Portfolio project routes retain the code-rain background. Standalone demo documents keep their own compositions.

The shader has no downloaded models, textures, or rendering-library dependency. Its glyph atlas is generated locally. The drawing resolution is capped, reduces after sustained slow frames, and pauses while the document is hidden. Reduced motion freezes animation time and removes pointer movement while preserving static color and section states. A WebGL failure falls back to a readable gradient. The trucking site does not mount this component.
