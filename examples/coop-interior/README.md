# Coop interior and trophy room

The playable coop has a furnished family floor and a second floor that opens at level 2. The original ground-floor region, exterior entrance, upgrade prices, quest gates, garden plots and family move-in progression remain.

| Upgrade | Home | Upstairs |
| --- | --- | --- |
| 1 | Kitchen, hearth, dining table, sofa and sleeping nest | Reading corner explains the level 2 upgrade |
| 2 | Mama Hen moves in; stairs replace the reading corner | Four trophy displays, curation desk and bench |
| 3 | Family nest bunks, Penny and the triplets | Seven displays |
| 4 | Gold trim and celebration bunting | Ten displays, gold cases and banners |

The honors recognize existing first-flight, nine-friend, ten-harvest, three-arcade-win, dream-coop, rooftop-race, complete-museum, village, sea and sky milestones. Inspecting a trophy explains its memory; an empty case explains the requirement and relevant progress. Trophies read the current save directly and update as milestones are earned. They grant no duplicate rewards and require no new save fields.

Stairs work through normal movement and the action button. Touch labels change to UP, DOWN, LOOK or REST as appropriate. Both floors use furniture footprints matching their art, with depth sorting for the furniture and displays. Nests retain the existing daytime/sleep/healing behavior. Old positions covered by furniture recover to nearby clear ground. Upstairs saves retain their floor; an invalid locked upstairs save returns to the family floor. Village residents retain their later move-ins.

Source:

- `src/content/coop_rooms.js`: layouts, display capacities, honors and their existing progress conditions.
- `src/engine/coop_interior_art.js`: native canvas room, furniture and individual trophy painters.
- `src/systems/coop_interior.js`: stairs, collision, inspection, sleeping, props and save recovery.
- `src/regions/coop.js`: original home region and the separate upstairs room at the formerly unused screen `[3,4]`.
- `tests/coop_interior.js`: 30 checks using actual movement, actions, upgrades, sleeping and save/load.

Validation:

- `node tools/build.mjs`
- `node tools/run-tests.mjs --out examples/coop-interior/regression-checks.json` — all 571 checks pass, including the standalone build.
- `node examples/coop-interior/verify.mjs` — focused gameplay checks and actual game captures; requires the local server on port 8082.
- `node examples/coop-interior/prepare-gallery.mjs` — embeds the original reference and current captures in `implemented.html`.
- `node examples/coop-interior/verify-ui.mjs` — all 14 gallery states, the locked level 1 floor picker, 320 px layout, phone stairs/inspection controls, day/night and enlarged text.

`baseline.json` is a frozen capture of the original room. The `--baseline` capture option refuses to overwrite it. `implemented.html` is the before/after gallery. `checks.json`, `ui-checks.json` and `regression-checks.json` contain the detailed results.
