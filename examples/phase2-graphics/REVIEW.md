# Phase 2 landscape review — October 16, 2026

## Beach and mountain follow-up

The user approved `coast-peaks.html`; its scenery is now applied to both beach and both mountain screens, in the development game and rebuilt standalone file. `landscapes-implemented.html` compares actual game captures in all four areas at two quest stages. The exact original 16 px palm and pine sprites, original sand/snow/water textures, native boulders and characters remain. Smaller groves and targeted landmarks replace the earlier large-tree study.

The beach has a gently shaped surf line, a small parasol/rescue point, stepped rock-pool rims, a fishing perch and a tidy city boardwalk. The existing five shell finds, turtle escort and lifeguard training remain. Mountains have shallow snow ledges, a compact trail, a rockslide pocket, a woven eagle nest, a narrow jagged glide gap and an ice nook. Rescue boulders and the egg reflect quest progress. The landmarks decorate existing activities and secrets.

Implementation preserves the existing quests, trainers, IDs, rewards, special finds and save progress. Two offshore shells still require Swim, rescue boulders require Super Peck, and the egg plateau requires Glide. Turtles complete the last steps into the water when Pip leads them to the bank. Fishing and the elevated egg have enough reach from their adjacent perches. Snowballs follow clear lanes, and one pine leaves a wider ice-nook passage. Old positions recover to clear ground while retaining progress and plateau side.

Sources: `src/world/landscape_layout.js` provides shared anchors and terrain masks; `src/engine/landscape_art.js` paints the approved landmarks; `src/systems/landscapes.js` integrates ground, props, characters, collectibles, collision and old-save recovery. `tests/landscapes.js` checks 23 gameplay outcomes using real movement and actions. `verify-review.mjs --landscapes` runs those checks and captures the actual game. `prepare-landscape-gallery.mjs` embeds the captures; `verify-review.mjs --landscape-ui` checks eight gallery states, narrow layout, phone actions and day/night enlarged text. `landscape-checks.json` and `landscape-ui-checks.json` record the results. The broader regression suites run with `verify-review.mjs --game --all`.

Editable source: `C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/beach-mountain-refinement.html`. `capture-terrain.mjs` copies original terrain assets without overwriting historical baseline captures. `prepare-coast-peaks.mjs` embeds them. `verify-review.mjs --coast-peaks` checks all four scenes, quest stages, exact palm/pine pixels, optional controls and 736/320 px layouts; results are recorded in `coast-peaks-checks.json`.

## Latest direction: original forest sprites with refreshed landmarks

The user prefers the original look, specifically the original tree sprites in the proposed new arrangement, with improvements limited to the house, coop, fields and beehives. `forest-sprites.html` is the revised forest study, comparing both forest areas with the original game. It uses the exact original 16×16 tree and oak tiles at native scale, original grass/dirt/water textures and character sprites, and groups trees around the new clearings. New landmark art includes a blue-roof cottage, a wooden coop with nest box and ramp, tilled crop rows and mature sunflowers, and woven hanging hives. The garden in front of the coop stays clear of the tree border.

The user approved this revised mix, and it is now applied to both forest screens in the game and rebuilt standalone version. `implemented.html` compares actual game captures at the future site and all four coop levels. The earlier `review.html` is retained as the original broader comparison. The later beach and mountain implementation also follows the user's preference for original tree art.

Editable revised source: `C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/forest-sprite-refinement.html`. `prepare-forest-sprites.mjs` embeds the original assets. Run `node examples/phase2-graphics/verify-review.mjs --forest-sprites` to check both areas/stages, exact original tree pixels, working design controls and responsive layout. Results are recorded in `forest-sprites-checks.json`.

## Earlier landscape concepts

Implementation sources are `src/engine/forest_art.js` (landmark painters), `src/regions/forest.js` (shared tree/path/river anchors) and `src/systems/forest.js` (terrain, collision, plot locations, oak actions and save recovery). The two existing Granny plot IDs and all twelve possible coop plot IDs are retained. Upgrades add compact beds to the west of the coop; maximum garden plots do not overlap each other or the tree border. The site sign and coop door follow their visible new positions. The original dam reward and swim gate are retained, and Clover still follows Pip back across the repaired bridge.

Final verification passes: 500 gameplay checks (22 forest and 478 existing checks), the standalone build, ten gallery states, 320 px gallery layout, emulated phone talk/plant controls, and day/night enlarged text. There are no browser errors. See `final-checks.json` for the combined report.

`node examples/phase2-graphics/verify-review.mjs --game --all --resume` runs the forest walking/action/save checks and existing gameplay suites, saving a checkpoint after each suite. The resume option retains passing results only when all source and suite files match the checkpoint fingerprint. `prepare-implemented.mjs` embeds actual captures in the gallery; `verify-review.mjs --implemented-ui` checks its states, narrow layout, emulated phone talk/plant controls and day/night text. `finalize-checks.mjs` combines the reports in `final-checks.json`.

The user requested a review of the remaining Phase 2 outdoor areas: forest, beach and mountains. These are **review concepts**. No game source or standalone build was changed for this review.

`review.html` compares current game captures with two approaches across all six screens:

- **Living landscapes** (recommended): reshapes terrain and organizes each area around its existing purpose. Forest Edge becomes Granny's cottage clearing and a future coop yard; Deep Woods gets a winding river, Bucky's timber work area, a broken/repaired dam and the fawn meadow. The beach gets a curved surf line, grassy dunes, a lifeguard lookout, turtle nesting sand, rock pools and the existing city connection. Mountains use layered snowy cliffs, a winding ascent, a visible rockslide rescue pocket, the eagle's nest, a jagged crevasse and an ice alcove.
- **Scenery refresh**: retains the existing tile layout and routes while refreshing trees, cottages, water, rock, snow, pools and other materials. The screen boundaries and rectangular water/cliff regions remain legible as the smaller-scope alternative.

The area picker covers Granny's clearing, Bucky's river, sandy shore, tide pools, mountain trail and eagle's peak. The quest-stage picker illustrates early exploration and selected later milestones: the built coop, repaired dam, rescued fawn/turtles/marmots and recovered egg. Tide-pool scenery remains the same between these stages. Optional design controls hide residents/Pip or reveal a route guide.

The layouts are illustrative art proposals, not a tested playable rebuild. The lifeguard shelter, timber work shelter, nest and cave/ice alcoves are visual landmarks, not promised new interiors or activities. Future implementation should retain existing quests, rewards, trainers, collected IDs and save state; preserve swim/glide and Super Peck gates, coop construction/gardens, the forest/beach/mountain/city connections, and Elda's later Sky Kingdom access. New art and collision footprints should agree, with access and old-save recovery checked as in the city/village passes.

Editable inline source: `C:/Users/Michael Honea/.codex/visualizations/2026/10/15/01a141e4-f1fd-7b72-9911-1889c7415f12/phase-two-landscapes.html`.

`capture-current.mjs` captures the six current game screens in both milestone states and copies the original character/item sprites. `prepare-preview.mjs` embeds that baseline in the inline source. The visualize renderer creates the standalone `review.html`. `verify-review.mjs` checks both six-scene sets, state changes, optional controls, browser errors and layouts at 736px and 320px. All checks pass in `review-checks.json`. Proposed captures use `concept-` and `overview-`; reference captures use `current-`.
