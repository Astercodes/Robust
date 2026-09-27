# ROBUST visual assets

Existing sunset colors, copy, links, and interactive content are preserved. The visual layer uses a sculptural pathway motif to illustrate professional formation. All 37 pages receive the shared hero treatment; the home page also includes the editorial illustration and motion study.

## Generated artwork

Created with the built-in image generation tool and encoded as WebP for delivery.

- `formation-sculpture.webp`: 1536 × 1024, decorative hero artwork.
- `career-worlds.webp`: square decorative editorial illustration.

### Hero prompt

Use case: stylized-concept. Asset type: premium professional formation website hero artwork. Create a striking sculptural 3D illustration of a continuous ascending ribbon pathway looping through three monumental translucent glass arches, representing exploration, practice and capability. Deep near-black plum environment (#130A17), luminous warm gold (#FFCA06) edges, coral (#E8675C), restrained magenta (#C91C7A) refractions. Floating architectural sculpture, satin ceramic and amber optical glass, tiny precise highlights, beautiful physically realistic studio rendering, sophisticated art direction, dramatically lit, calm and aspirational. Landscape 3:2 composition, centered sculpture with generous dark margins, complete object visible, no text, no letters, no UI, no logos, no watermark, no people. Dark background must blend into #130A17 at edges.

### Editorial prompt

Use case: stylized-concept. Asset type: square editorial illustration for ROBUST professional formation website. An exquisitely art-directed miniature universe of professional possibilities: five floating circular architectural islands linked by fine luminous gold pathways, one with a sculptural observatory sphere, one with a stylized architectural model, one with abstract design tools and coral folded paper, one with a tiny glass greenhouse, one with an abstract precision engineering assembly. Unified sophisticated isometric 3D illustration, tactile matte plum ceramic, transparent amber glass, brushed champagne metal. Deep plum #130A17 background, sunset gold #FFCA06, coral #E8675C and muted magenta #C91C7A accents. Museum-quality miniature sculptural still life, soft cinematic lighting, detailed but uncluttered, strong negative space at edges, visually connected composition. No people, no text, no letters, no logos, no interface, no watermark.

## Motion

`formation-orbit.webm` is an original eight-second, 960 × 720, silent VP9 motion graphic rendered from Canvas, accompanied by `orbit-poster.webp`. It is a procedural animation, not AI-generated video footage. Rebuild with `node tools/render-motion.cjs` using Playwright and Edge (or set `BROWSER_CHANNEL`). Convert the generated PNG poster to WebP before delivery.

The hero combines the generated sculpture with CSS orbital travel and gentle floating motion. Motion controls pause all animation. Reduced-motion preferences default to still imagery; video only loads near the viewport, pauses outside it, and pauses when the tab is hidden. Failed autoplay retains the poster. Without JavaScript, the original content and layout remain available.

## Verification

Serve the project on localhost:8765 and run `node tools/check-visuals.cjs` with Playwright available. The check compares all original page text and links, checks the video and pause control, checks reduced motion, and inspects representative pages at mobile, tablet, and desktop widths. `BASELINE_REF` can override the original remote branch and `QA_DIR` can override the screenshot destination.
