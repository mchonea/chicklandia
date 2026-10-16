# City interiors and rooftop review

## Applied October 16, 2026

The user approved the furnished interiors and **Roofline run** second take. Both are now implemented in the game and the standalone build. `implemented.html` is the actual before/after capture gallery; the following concept notes are retained as review history.

Native artwork lives in `src/engine/city_interior_art.js` and `src/engine/rooftop_art.js`. Room footprints, cast placement, reading/stair interactions and gull behavior are in `src/systems/city_interiors.js`; rooftop geometry is in `src/regions/rooftops.js`. The existing race reward and timer code remains in `src/systems/city2.js`.

Verification: `tests/city_interiors.js`, `verify-implemented.mjs`, `verify-implemented-ui.mjs`, and the existing full gameplay suites. All 478 gameplay checks, standalone rendering, gallery controls and phone checks pass; see `final-checks.json`. `consolidate-checks.mjs` combines the source reports. Current captures use the `implemented-` prefix and preserve the original `current-` baselines.

## Earlier concept review

- The user selected **Furnished interiors** from the original `review.html`. This selection is recorded for the next implementation pass; the rooms remain concept previews.
- The user preferred **Roof art only** over the marked circuit, and requested a second take with upper facades below the roofs, back yards above, alleys between buildings, obstacles, and a possible enemy.
- `rooftop-second-take.html` shows **Roofline run**, a purpose-built four-building rooftop scene with three alley crossings. It does not use the city overview as a background.
- The new artwork includes cornices, shutters, upper-story windows, fenced yards, laundry, gardens, chimney stacks, raised skylights, and short hop-over pipes. A nesting gull has perched, warning, swooping, and returning poses; the button previews those poses locally.
- This is a visual and encounter proposal for review, not a playable minigame or a gameplay change. The camera crops and star placements are illustrative.

Editable inline source: `C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/rooftop-second-take.html`.

`prepare-rooftop-second.mjs` embeds the existing Pip, star, and weathervane sprites from the captured baseline. The remaining scene is drawn directly as native-resolution pixel art. The standalone page is wrapped with the visualize skill's renderer.

`verify-rooftop-second.mjs` verifies all three course views, four distinct gull poses, the three optional design controls, browser errors, and layouts at 736px and 320px. The report is `second-take-checks.json`; screenshots use the `second-take-` prefix.
