# ROBUST visual direction

The site uses 16 contextual, generated visuals instead of repeating an abstract sculpture. All are saved beside this document as optimized WebP files. Exact prompts are in `image-prompts.json`; all images were generated with the built-in image-generation tool.

| Asset | Subject and intended placement |
| --- | --- |
| career.webp | Students demonstrating a working prototype; Career hero and professional formation |
| business.webp | Founders testing products and packaging; Business and venture discovery |
| trades.webp | Apprentice and experienced technician at a training bench; Trades |
| creative.webp | Art director and filmmaker producing a stop-motion set; Creative and briefs |
| campus.webp | Connected university teaching and making spaces; institutions and campus programs |
| employers.webp | An engineer reviewing a candidate's prototype; employers and talent pipelines |
| facilities.webp | Fabrication, recording, and digital workspaces; infrastructure and resource access |
| mentorship.webp | A mentor listening to a learner explain her work; mentoring and critique |
| capital.webp | Funding tangible milestones; sponsors and investors |
| civic.webp | Connected college, workshops, and local businesses; government and workforce |
| practice.webp | Hands measuring, sketching, and testing; practice and buildroom sections |
| portfolio.webp | Sketchbook, model, photographs, sculpture, and prototype; evidence and portfolios |

Heroes are explicitly mapped by page in `js/visuals.js`. Supporting illustrations are matched to section topics. Images are not duplicated within a page. Long pages receive up to six illustrated sections; shorter pages use fewer. The illustrations are decorative examples, not claims about real facilities or participants.

Additional section illustrations: `creative-work.webp` (multidisciplinary art and music workbench), `business-experiment.webp` (product-testing iterations), `career-map.webp` (objects representing six professional fields), and `trades-workshop.webp` (technical training spaces).

## Four original motion studies

Every hero includes an eight-second, silent, looping WebM animation selected by its discipline:

- Career: learning, practice, project, evidence, and work icons connected by a progressing path.
- Business: a plan becomes a product and passes validation milestones.
- Trades: a technical schematic with moving gears and a verification endpoint.
- Creative: layered poster artwork, moving composition, and an editing timeline.

These are original procedural Canvas animations, not AI-generated video footage. Rebuild using `node tools/render-context.cjs` with Playwright, Sharp, and Edge available. Their matching WebP posters remain visible if playback is blocked. Motion pauses offscreen, in hidden tabs, when manually paused, and by default with reduced-motion preferences.

## Validation

`tools/check-context.cjs` verifies the original HTML content against the pre-design commit and checks rendered text/link preservation with enhancement enabled and disabled. It inspects all 37 pages at desktop, tablet, and mobile widths, records image placements, and verifies each of the four films, pause controls, reduced motion, and mobile navigation. Serve the repository on localhost:8765 before running it.

The older sculpture and orbital assets remain in version control for historical reference but are no longer referenced by the website.
