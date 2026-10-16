# Chicklandia — Project Status

*Review date: October 16, 2026*

## Terrain test gaps and one-command test run (October 16, 2026)

- **Run all tests:** `npm test` (`tools/run-tests.mjs`) loads a fresh `?debug=1` page for each of the 12 suites, runs them in one pass, then checks that the standalone build starts. It needs Playwright with Chrome (set `PLAYWRIGHT_MODULE` if `playwright` isn't installed). Add `--out report.json` for a report, or name suites to run only those. All 541 checks pass.
- **New suite `tests/terrain_gaps.js` (17 checks):** smashing Bucky's three moved stumps and finishing the lesson; plain-tree pecks change nothing while nearby dig spots still work; unique oak keys; Swim without Flutter; collision across area borders matching both sides; no hidden tile edits in the painted areas; turtles only head for the surf when led; the Dream Coop roof; Clover beside Doe after loading. It also loads five real saves from commit 2f1dcad (`tests/fixtures/save_2f1dcad.json`) and checks clear landing spots, quests, crops, all 14 plots and an old uncollected acorn.
- **Fixes it found:** five pairs of forest oaks shared an acorn key, so pecking one emptied both. Keys now use the tile under each canopy's centre. Swim alone now crosses the shallow surf, so both offshore shells can be reached without Flutter. Collision boxes crossing the forest, beach or mountain borders used to fall back to the rough tile grid, which let Pip pass a boardwalk post and a strip of deep water at the city edge and caught on the mountain trail. They are now split at the border so each side uses its own collision.

## Beach and mountain scenery (October 16, 2026)

- Applied the approved coast-and-peaks study to all four playable screens. Original native 16 px palms, pines, boulders and sand/snow/water textures remain. The shore has curved surf, a parasol rescue point, shaped tide pools, a fishing perch and city boardwalk. Mountains have snow trails and ledges, the rockslide pocket, a woven eagle nest, a jagged glide gap and the ice nook.
- Painting and collision share the landscape anchors. Existing characters, turtle and marmot rescues, shells, life-ring training, soup and cook-off ingredients, museum finds, secrets and hazards follow the new scenery. Turtles take their last steps into the waves when led to the bank; Pip can stay on dry sand. Two offshore shells retain the Swim requirement. The rockslide still requires Super Peck, and the egg plateau requires Glide. The fishing rod and elevated egg have appropriate interaction reach.
- Existing quest/collectible IDs, rewards and save format remain. Older saves recover to clear ground, retaining progress and the correct side of the mountain gap. The original snowball lanes now run through clear snow. One pine leaves a comfortable passage to the ice nook; collectible sprites are clear of the regrouped trees.
- Actual before/after game captures: `examples/phase2-graphics/landscapes-implemented.html`, with four areas and two quest stages. The approved art study remains in `coast-peaks.html`. Both the development game and `dist/chicklandia.html` contain the update.
- Validation covers real walking, talking, turtle escort, fishing, berry picking, shell/ring gathering, Super Peck rescue, Glide/egg pickup, secret digging, hazard responses and old-save recovery. The phone checks cover talking, fishing, rescue, controls, day/night enlarged text and the 320 px comparison gallery. Reports: `landscape-checks.json`, `landscape-ui-checks.json` and the combined `final-checks.json` in `examples/phase2-graphics/`.
- Final combined verification passes all 523 gameplay checks (23 landscape checks plus the existing 500), the standalone build and both galleries' UI checks, without browser errors. The full regression run was followed by final targeted landscape and smoke checks. The smoke explorer now uses normal peck input around the relocated shore crabs.

## Original-tree forest refinement (October 16, 2026)

- Applied the approved forest mix to both forest screens: the original 16 px tree and oak art in grouped groves, original grass/path/water textures, a blue-shingled cottage, a wooden coop with nest box and ramp, tilled garden rows and woven hives. The Dream Coop retains its golden roof. The connected clearings include the winding river and broken/repaired timber dam from the review.
- Trees, the cottage, coop, river and dam have physical footprints matching their art. Oak pecking follows the displayed canopies; the existing bees still chase and respond to Wing Flap. Granny, Bucky, Doe, Clover, the hollow-log secret, sticks and training stumps remain accessible in the new arrangement.
- All garden plot IDs are retained, including Granny's two plots, the eight coop plots and four purchased extras. Their new positions leave the expanded garden clear of trees and other beds. Planting selects the closest plot in front of Pip. Growth, special seed types, harvesting, coop levels and family move-ins keep the existing mechanics. Older forest saves recover to clear ground while keeping crop and quest progress.
- Actual game captures and before/after views: `examples/phase2-graphics/implemented.html`. The selected study remains in `forest-sprites.html`; the later approved beach and mountain refinement is described above. `dist/chicklandia.html` has been rebuilt.
- All 500 gameplay checks pass: 22 new forest checks plus the 478 existing checks across the city, interiors/rooftops, smoke, village, coastal, sea and sky suites. The forest checks use real movement and actions for oak gathering, residents, construction, coop entry/exit, every plot, dam crossing and Clover's rescue, plus progress preservation on old saves. The standalone build, ten gallery states, 320 px gallery, emulated phone talk/plant controls and day/night enlarged text checks also pass without browser errors. Consolidated report: `examples/phase2-graphics/final-checks.json`.

## Furnished city interiors and Roofline Run (October 16, 2026)

- Applied the selected furnished treatment to all 13 city interiors: larger cutaway rooms, wall trim and windows, distinct shop displays, homes, studio furniture, museum cases and the library reading corner. Furniture painters record matching collision footprints. Residents, their night schedules, exhibits, the easel, reading nook, arcade holes and toy shop stairs follow the new layouts.
- Replaced the old brick platforms with the approved four-building rooftop scene. Upper facades and cornices fill the lower view; fenced yards, gardens and laundry sit above; three narrow alleys separate the terraces. Chimney stacks, raised skylights, dormers and hop-over pipes are physical obstacles. Roof props participate in depth sorting; alley glide art follows the precise gap boundaries. Back yards and facades are outside the playable roof area.
- One nesting gull gives a 48-frame warning, commits to the marked target, swoops once and returns with a cooldown. Moving out of its warned path dodges it; a peck or wing flap interrupts it. The existing 90-second race, any-8-of-10-star goal, goggles, seed/growth rewards and best-time record remain. A larger flag changes from gold to green at eight stars; the race HUD keeps hearts visible.
- Every room entrance, resident interaction, stair direction, reading nook and arcade hole is accessible. The duckling homecoming area matches the wider flat. Loading an older position covered by furniture or the new roof boundaries moves Pip to nearby clear ground while retaining progress. Indoor scenes exclude scenery from adjacent outdoor screens.
- All 478 gameplay checks pass: 24 new interior/rooftop checks and all 454 existing checks across the city, smoke, village, coastal, seas and sky suites. The new suite completes the race using normal movement and verifies pipe hops, glide gates, gull warning/damage/dodging/defenses, race timeout, old-save recovery and six arcade targets. The standalone build, gallery controls, 320 px layout, emulated phone talk control and enlarged race text also pass without browser errors. Consolidated report: `examples/city-interiors/final-checks.json`.
- Actual before/after gallery: `examples/city-interiors/implemented.html`. Earlier interior and rooftop concepts remain available beside it. `dist/chicklandia.html` has been rebuilt with the update.

## Market-town city update (October 15, 2026)

- Applied the approved neighborhood direction across the city. Main Street is an attached brick terrace with a shared slate roofline, cornice and upper-floor windows; the boutique, Seed & Feed, bakery and toy shop have different ground-floor awnings and displays. The gate, library, museum, bistro and four homes have distinct facades.
- City Gate has a fountain green beside its through route. Market stalls and cafe tables sit along the square's edges. The park has a shaped pond, gazebo and bandstand; Residential Lane has a shared garden court and laundry line. All three northern approaches stay open. The existing Coastal Adventure harbor is retained.
- `CITY_LOTS` provides the shared building and door coordinates. New scenery uses cached native pixel art and participates in depth sorting with matching collision boxes. Window lights, street lamps, opening-hour signs and enlarged sign text work at night and with the accessibility setting.
- All 13 original city interiors, shop inventories, activities, rewards and save IDs are retained. Park quest stops, the park seed, a fossil mound and daytime residents follow the new layout. Loading an old city position covered by a building or scenery moves Pip to nearby clear ground.
- All 454 gameplay checks pass: 11 new city layout checks plus the existing city, smoke, village layout, village, coastal, sea and sky suites. The new checks physically walk all 13 doors in and out, district/forest/village/harbor connections, the three northern approaches, all city finds, duckling stops and the sunbeam. They also cover daytime resident clearance and old-save recovery. The pond-side bench was moved clear of its access path after the first route check.
- Standalone rendering, day/night captures, gallery controls, a 320 px gallery, enlarged text and emulated phone entry/talk controls pass. Consolidated report: `examples/city-graphics/final-checks.json`; source reports are retained beside it. Actual game gallery: `examples/city-graphics/implemented.html`, with six area views and before/now comparisons. Rebuilt `dist/chicklandia.html` includes the update.

## Village neighbourhood layout (October 15, 2026)

- Mill Reach refinement: the northern approach now follows one straight lane from Festival Hill into the bridge junction. Removed its one-tile sidestep and the spur through Clyde's wagon bay; the lower mill has one driveway to the same lane. Flour sacks and barrels sit on the east verge, and the hill cart is parked clear of the approach. Mill lots, resources and rewards retain their IDs and positions. All 25 neighbourhood checks pass, plus standalone rendering, review controls and emulated touch construction; report: `examples/village-graphics/mill-approach-checks.json`. The review retains the previous mill approach for comparison.
- Market Square refinement: the bakery and neighbouring lot now flank a straight stone entrance and one uninterrupted paved court. The well and bench occupy the west side; the mailbox, noticeboard, whistle post and Barnaby are grouped to the east. Removed the extra produce stall. Paving is applied after the approach lanes, and stone curbs clearly separate paving from dirt at village junctions. Existing lot IDs retain saved buildings through the move. The review's Market Square comparison preserves the previous arrangement.
- Rebuilt the village's eight screens as one connected meadow, with winding dirt paths, a smaller paved market square and tree groves between places. Village Green has a large seasonal shade tree, picnic table, playground and two building lots; Festival Hill has a tapered windmill, stage lot, audience benches, bunting and seasonal contest displays. Market Square and Cottage Lane hold the remaining neighbourhood lots.
- The former wood clearing is now Bucky's builders' yard with a workshop, covered lumber rack, sawbench, chopping stump, carts and pond. Mill Reach has a bending stream and a bridge beside the mill wheels. Community Gardens has raised beds and an orchard; Sheep Meadow has an open pasture gate, shelter, hay and trough. All use the existing gathering, building, gardening and contest mechanics.
- Resident move-ins add the promised mud pond, cushion, hay wagon, dairy stool and pail, blanket basket, school desks and stone stage. Whiskers and Penny visit the green using the existing day/night schedule system.
- The same ten lot IDs, eight unrestricted lots, two river lots, costs, rewards and save format are retained. Buildings and construction follow their IDs to the new positions; crop coordinates stay fixed so growth and watering survive. Loading a village position covered by new obstacles moves Pip to nearby clear ground. One stone node, one whistle pebble and winter snowballs were repositioned for access.
- All existing gameplay suites and `tests/village_layout.js` pass. The new checks physically walk finished building approaches, resources, crops, sheep, training items and snowballs without swimming or flying; they also verify real building interactions, resident additions, schedules and save recovery. Reports: `examples/village-graphics/neighborhood-checks.json` and `neighborhood-regressions.json`. Standalone rendering, the review controls, narrow layout and emulated touch construction also pass. The test walker's breadth-first queue now advances by index instead of repeatedly shifting the array.
- Actual game review: `examples/village-graphics/neighborhoods.html`, with a seasonal map, eight area views, earlier captures and the starting green. The earlier building-only gallery is preserved. Rebuilt `dist/chicklandia.html` includes the complete update.

## Market Village building sprites (October 15, 2026)

- Applied the selected Market Village direction to the six buildable village buildings: gabled homes with flower boxes, a striped bakery awning and bread counter, a timber watermill with an eight-paddle wheel, an open bandstand, a school bell tower and a clinic porch with a clear cross badge.
- Artwork has explicit foot anchors so larger roofs and the asymmetric wheel retain the original building locations and interaction footprint. Construction crops use the actual sprite dimensions, scaffolds fit each building and the build menu uses the new sprites. Completed lots show the surrounding ground through transparent roof corners instead of the empty building-pad stakes.
- Village terrain, paths, collision sizes, building costs, resident behavior and save format are retained. The hill's existing landmark windmill is outside this six-building update.
- All 51 village checks and 30 smoke checks pass. Sprite checks cover crisp pixels, canvas bounds, catalog fit and alignment through four construction stages; the standalone build also renders the updated artwork. Reports and rerunnable checks are in `examples/village-graphics/building-checks.json` and `verify-buildings.mjs`.
- Before-and-after gallery: `examples/village-graphics/implemented.html`. The original broader village concepts remain in `review.html`.

## Coastal Adventure sea overhaul (October 15, 2026)

- Implemented the selected Coastal Adventure direction at the existing 256 × 224 resolution. The sea chart now has island silhouettes, shallow-water rims, landmarks, route highlighting, a compass and readable upgrade locks. Sailing has its own animated ocean scene, a large rigged ship, Pip aboard, wake and an approaching destination.
- Shared artwork in `src/engine/coastal_art.js` keeps the ship consistent between chart, voyage, shop and docks. Better sails, hull reinforcement and the seed cannon each change its appearance independently; ship and island sprites are cached.
- Authored continuous two-screen coastlines replace the rectangular islands: Pirate Cove has a bay, Coral Reef wraps a lagoon, Volcano Isle has a jagged basalt coast, and Lighthouse Rock has rocky promontories and a striped tower. The flagship has a shaped bow/stern, railings, cannon ports and edge rigging that leaves boss tells visible.
- City harbor has one pier, a gangplank, mooring ropes, a single boat and an open ocean frontage. Pinch stands on the quay; both his menu and the gangplank work. Quest coordinates, travel gates, rewards and save format are retained. A save on a newly blocked coastal tile returns to its safe landing.
- All five existing gameplay suites and the new `tests/coastal.js` pass. The coastal checks walk quest/training routes without swimming, board from every dock, verify independent ship upgrades, old-save recovery and both map text sizes. Reports: `examples/sea-graphics/game-checks.json` and `coastal-final-checks.json`; final checks also cover the standalone build and emulated phone layout/controls.
- Actual game capture gallery: `examples/sea-graphics/implemented.html`. The earlier concept comparison is retained in `review.html`. Build output is regenerated in `dist/chicklandia.html`.

## Bright Adventure graphics refresh (October 15, 2026)

- **Implemented at the original resolution:** 16 px tiles and 256 × 224 canvas. Bright Adventure uses navy outlines, leafy greens, warm gold and clear blue water throughout sprites, buildings, effects and UI.
- Redrawn tree canopies and fruit, clustered bush and leaf-pile shading, quieter grass/path/sand/snow/cloud textures, wider interior floorboards and city paving, and finer pond shorelines. Pip has forehead highlights and belly shading across the existing growth/animation system; hen, pig and sheep shading is refined. Clay sprites now have their missing `O` palette shade instead of the magenta fallback.
- Menu panels, text accents, shadows and touch-control colors follow the same direction. World layout, collisions, save format, sprite sizes and outfit head anchors remain unchanged.
- **Verified:** build succeeds; all 389 existing smoke/city/village/seas/sky checks pass, plus three graphics checks for canvas resolution, 16 × 16 tiles and growth-frame dimensions/anchors. Results: `examples/graphics-checks.json`. Review gallery: `examples/graphics-review.html`; run `node tools/serve.mjs 8081` to use its isolated gameplay-check origin. Existing visual concepts use frozen reference assets under `examples/reference-art/`.
- This is a unified palette and pixel-art refinement pass; existing NPC silhouettes and region-specific landmarks are preserved, rather than every asset receiving a new silhouette.

## 0. Phase 1 progress (updated Oct 14, 2026)

- **1A (restructure): done.** Git repo, `src/` split into plain script files (not ES modules, so the dev shell also works from `file://`), `npm run build` -> `dist/chicklandia.html`, `npm run dev` -> http://localhost:8080, duplicate HTML removed, debug hooks only with `?debug=1`. **Regions:** each area is a `defineRegion({...})` file in `src/regions/` (farm, rooms, secrets, mountains, coop, forest, city, beach); `src/world/regions.js` stitches them into the tile grid (verified identical to the old map). Walkable sets, indoor/cave/outdoor kind, area names, ground type, music and HUD labels come from region data. Saves store Pip as `{region,x,y}` (`sv:3`); old saves still load. **Content is data** in `src/content/`: `skills.js`, `outfits.js`, `quests_farm.js`, `quests_beyond.js` (quest = title, check(), prog(), intro/remind/done/after lines, hint(), reward), `trainers.js`, `coop.js`, `world_data.js`, `characters.js` (the cast, with positions), `dialogue.js` (special conversations as `TALK[id]` handlers). The engines are `systems/dialogue.js` (talk, hints, rewards) and the other `systems/` files. To add a quest: add an entry to `QUESTS`, its id to `ORDER`/`ORDER2`, its giver to `CHARACTERS`. **Still hard-coded:** the minimap grids, fly-map nodes, minigame text.
- **Tests:** `tests/smoke.js` (run in the page with `?debug=1`) walks Pip to every secret spot and checks hazards, region mapping, save round trip, new-game confirm and pause. All pass.
- **1B (fixes F1-F13): done and tested by script in a browser.** Part 2 seed budget is now 32 quest seeds + 4 hidden = 36 (counter max `TOTAL_SEEDS2`). Save keys: `chicklandia_save_v2` (progress; old saves migrate seed tallies) and `chicklandia_settings_v1` (settings). Pause: P/Esc or the menu button.
- Hazards and secret spots live in `src/systems/hazards.js`. Pause menu in `src/ui/pause.js`.
- Not yet verified: real-device touch for the new pause button, audio volume by ear, walking (not teleporting) to each new secret spot.

## 0b. Phase 2 (growth backbone): built (Oct 14, 2026)

Pip now grows through **growth points (GP)**. Data: `src/content/ranks.js` (ranks, GP values, Taste Log foods). Logic: `src/systems/ranks.js` (GP, rank-up scene, snack bowl, treasure sense), `src/systems/festival.js` (finale + credits), `src/ui/journal.js` (Growth Journal, 3rd page of the Growth screen: press X/B to flip).

| Rank | Name | GP | Story gate | Perk |
|---|---|---|---|---|
| 1 | Teeny Peep | 0 | | |
| 2 | Little Chick | 40 | | +5% speed |
| 3 | Growing Chick | 100 | | hidden things twinkle when close |
| 4 | Big Chick | 170 | | +1 heart |
| 5 | Almost a Chicken | 235 | learned Flight | fly-map trip takes half as long |
| 6 | Young Chicken | 350 | | harvests +1 seed; new white-feather sprite |
| 7 | Grown-Up Chicken | 420 | Coming-of-Age Festival | +1 heart, accessory slot; adult sprite |
| 8 | Village Hero | 780 | village finale | sash; village gathering always +1 material |
| 9 | Captain of the Seas | 960 | beat Squawkbeard | badge; air lasts 50% longer, sailing 20% faster |
| 10 | Legend of Chicklandia | 1190 | beat the Storm Dragon | golden aura; +1 heart, Wing Flap recharges twice as fast |

**Where growth comes from** (as built): quest 10 (Part 1) / 12 (Part 2); training 8; skill 5; first taste of a food 4; minigame first win 8, repeat 2 (max 3 a day); secret area 6; hidden seed 2; new outfit 3; coop upgrade 6; garden harvest 1; snack bowl 1 per seed (the bowl is in both coops once Flight is learned).

**Growth budget (all of it, no garden/snack):**

| | Part 1 | Part 2 |
|---|---|---|
| Quests | 11 x 10 = 110 | 9 x 12 = 108 |
| Trainings | 2 x 8 = 16 | 2 x 8 = 16 |
| Skills | 8 x 5 = 40 | 4 x 5 = 20 |
| Taste Log | worm, carrot, apple, cheese = 16 | acorn, fish, snowberry = 12 |
| Minigames (first win) | 3 x 8 = 24 | |
| Secret areas | 3 x 6 = 18 | |
| Hidden seeds | 5 x 2 = 10 | 4 x 2 = 8 |
| Outfits | 8 x 3 = 24 | |
| Coop upgrades | | 3 x 6 = 18 |
| **Total** | **258** | **182** |

Rank 5 (210) is 81% of Part 1. Rank 7 (390) needs all of Part 1 plus Part 2's required content (quests 108 + coop 18 = 126), so skipping Part 2's optional content still works; the garden and snack bowl fill any gap. **Festival trigger:** all 9 Part 2 quests, coop level 4, 390+ GP, then talk to Granny Shell. If points come before the story event the HUD bar flashes FULL! and the hint system names the event.

**Save:** progress keeps `chicklandia_save_v2`; new fields gp, rank, taste, secrets, mgFirst, mgDay, acc. Old saves get retroactive growth on load (quests, trainings, skills, outfits, minigames, secrets, hidden seeds, coop, harvests) and a "You've grown!" message.

**Not verified:** how the rank-up fanfare sounds, real-device touch for the Growth Journal page button, and a long human playthrough to tune the GP numbers.

## 0c. Phase 3 (city expansion): built (Oct 14, 2026)

```
City (region "city", 6 outdoor screens)           Interiors (region "cityin", 13 rooms)      Rooftops (region "rooftops", 3 screens)
 Gate: Post Office, Rocco's Den  - Main Street - Park     post, rocco, bistro, boutique, seed,       Toy Shop stairs -> start platform
 Market: Remy's Bistro           - Lane        - Harbor   bakery, toy, cleo, artist, ducks, loft,    Rooftop Race + Pidge's weathervane
 Main St: Boutique, Seed&Feed, Bakery, Toy Shop            library, museum
 Park: Library, Museum, gazebo, pond, bandstand
 Lane: Cleo, Artist, Duck Flat, Pidge's Loft
 Harbor: piers, Cap'n Pinch's ship ("not ready yet" sign)
```

**Code map.** Buildings, doors and hours: `src/content/city.js` (BUILDINGS). Shops: `src/content/shops.js` (data) + `src/systems/shops.js` (one reusable catalog screen). City quests, museum exhibits, hiding places: `src/content/quests_city.js`. Treats, special seeds, parcels, museum, library: `src/systems/city.js`. Residents' routines, quest mechanics, Rooftop Race: `src/systems/city2.js`. New tiles: door, ship, crates, roof, bookshelf, museum case. New sprites: `src/entities/sprites_city.js`.

**What is in it.** Shops are open in the daytime and show CLOSED at night (the Bakery opens at sunrise; homes are always open). Boutique: Maggie moved here from the farm (a sign marks her old spot), plus Chef Hat (+1 growth per new food) and Detective Cap (adds a Detective Notes page to the quest log). Seed & Feed: Speedy Sprout, Giant Sunflower, Moonflower (grows only at night, drops a museum petal), +2 garden plots (up to 4 extra). Bakery: three one-day treats that also count as new foods. Toy Shop: replay the 3 minigames, the Rooftop Race (needs Hop + Glide, wins Racing Goggles), and coop decorations. Post Office: 1-2 parcel jobs per in-game day. Library: free hint books, lore, reading nook. Museum: 4 exhibits (shells, feathers, fossils, moon petals). Six home quests: Rocco's Borrowed Things, Cleo's Sunbeam (noon only), Remy's Cook-Off, Pidge's Weathervane (rooftops), Duckling Duty, Pablo's Portraits. Rocco, Cleo, Remy are out by day and home at night; Pidge works at the post office by day and sleeps in the loft.

**Seed budget (Part 2 + city).** *Sources:* Part 2 quests 32, Part 2 hidden seeds 4+2, city quests 28 (4+4+5+5+5+5), museum 21 (5+5+5+6), parcels 2 each (1-2 per day, unlimited), garden. *Sinks:* Sky Tree 21, coop upgrades 18, special seeds 1/3/2 each, extra plots 12, treats 2-3 each (daily), nest decorations 9, Chef Hat 4, Detective Cap 4, snack bowl. Seeds now always have somewhere to go.

**Growth budget added by the city:** quests 6 x 14 = 84, new foods 4 x 4 = 16 (muffin, bun, tart, stew), outfits 3 x 3 = 9, Rooftop Race first win 8, museum exhibits 42, hidden seeds 4, secret (the rooftops) 6, plus 3 per parcel. About 169 on top of Part 1 (246: the four shop outfits are no longer sold on the farm) and Part 2 (182).

**Tests.** `tests/city.js` (with `tests/walk.js`) checks opening hours, entering and leaving every building on foot, buying, special seeds, treats, parcels, museum, all six quests, schedules, the race and the save round trip. `tests/smoke.js` still passes. **Not verified:** touch on a real device, a human playthrough of the quests, the sound of the new interactions.

## 0d. Phase 4 (Chicklandia Village): built (Oct 14, 2026)

```
Windmill Hill (0,7)(1,7)  | Village Square (2,7)(3,7)  <- road south from the city Market Square (opens after Bucky's survey)
Riverside     (0,8)(1,8)  | Meadow Farmlands (2,8)(3,8)
```

**Unlock.** After the Coming-of-Age Festival, Bucky (deep woods) starts "A Village At Last": the market road opens, the fly map gets a Village node, and Pip gets the Farmer Cap when the first building is finished.

**Code map.** Data: `src/content/village.js` (building types, pads, material spots, residents and wishes, seasons), `src/content/quests_village.js` (9 quests + hints), `src/regions/village.js` (4 regions / 8 screens), skills in `src/content/skills.js` (SKILLS3), trainers in `src/content/trainers.js`. Logic: `src/systems/village.js` (materials, building, mailbox, residents, seasons, contests), `src/systems/festival.js` (Grand Harvest + Cap'n Pinch scene). Art: `src/entities/sprites_village.js`.

**How it plays.** Peck wood, clay and stone at the Riverside and shear sheep in the meadow (wood/stone/clay come back each in-game day; stone needs CARRY). Spend seeds + materials on the 10 building pads (home, bakery branch, watermill (river pads only), bandstand, school, clinic); a building takes about a minute to finish (half with Master Builder, which also saves 1 wood). When a matching building stands, a friend writes to the village mailbox with one wish; give the materials and they move in (Porkchop, Whiskers, Clyde, Daisy, Doe, Penny, Sir Cluckington). Mill pays 2 seeds a day, clinic heals. Village happiness = buildings + 8 per friend + 5 per contest win; the Grand Harvest Festival needs all 7 friends and 100 happiness: talk to Foreman Barnaby. The festival makes Pip a **Village Hero (rank 8)**, then Cap'n Pinch sails into the harbor with the treasure map (sets `flags.pinchMap`, which Phase 5 will use).

**Village Tree** (new page in the Growth screen): Carry, Whistle (taught by Dash, needs 3 pebbles), Green Wings (flap waters crops), Master Builder (taught by Foreman Barnaby, needs 3 fine planks and 2 buildings).

**Seasons.** A season lasts 3 in-game days (spring, summer, autumn, winter). They tint the village, add falling petals/leaves/snow, and change crop speed (winter half, spring +25%). Each season Windmill Hill has one contest (egg race, kite catch, giant pumpkin, snow sculpture) that can be won once per season.

**Growth budget added by the village:** quests 9 x 14 = 126, skills 4 x 5 = 20, trainings 2 x 8 = 16, each finished building 4 (10 pads = 40), contest wins 8 each (first year 32), pumpkin food 4, Farmer Cap 3: about 241. Running total of fixed content: Part 1 246 + Part 2 182 + city 169 + village 241 = 838; rank 8 needs 650 (78%).

**Seed budget:** sources: village quests 42 (6 + 7 x 4 + 8), contests 4 each, mill 2 a day, harvests, parcels. Sinks: buildings 4-6 seeds each, Village Tree 25, plus everything older.

**Tests.** `tests/village.js` (with `tests/walk.js`) checks the closed road, walking to every village spot and pad, gathering and CARRY, both trainers, whistle, building, materials, letters, all 7 move-ins, happiness, seasons, all contest types, the Grand Harvest, rank 8, the Pinch scene and the save round trip. Smoke and city tests still pass. **Not verified:** touch on a device, the sound, a human playthrough, how long a full village takes to build.

## 0e. Phase 5 (Pirate Seas): built (Oct 14, 2026)

```
Pirate Cove (0,9)(1,9) + Smuggler Caves (0,15)(1,15)      Coral Reef (3,9)(4,9) + Deep Reef underwater (3,11)(4,11)
Volcano Isle (0,11)(1,11)                                  Lighthouse Rock (0,13)(1,13)      Squawkbeard's flagship (3,13)
```
Islands are separated by empty screens, so they can only be reached by ship. There is no fly-map node for them: the ship's sea chart is the travel map.

**Start.** After the village finale (flag `pinchMap`), Cap'n Pinch moves next to his ship at the city harbor. Talk to him: "Set Sail!" opens the seas. The ship menu (Pinch, or the ship at any island's dock) has SET SAIL and three upgrades: Better Sails (8 seeds + 3 sailcloth, unlocks Volcano Isle), Stronger Hull (10 seeds + 4 hull planks, unlocks Lighthouse Rock), Seed Cannon (12 seeds + 2 cannon parts, with a lit lighthouse unlocks Squawkbeard's ship).

**Code map.** Data: `src/content/seas.js` (positions, sail map, upgrades), `src/content/quests_seas.js` (9 quests), `src/regions/seas.js`, music in `src/engine/tracks_seas.js` (5 new tracks), skills in `src/content/skills.js` (SKILLS4), trainers in `trainers.js`. Logic: `src/systems/seas.js` (sailing, upgrades, warps, air, Dash, Cannon Peck), `src/systems/seas2.js` (enemies, puzzles, boss, chase, ending), `src/systems/seas_draw.js`. Art: `src/entities/sprites_seas.js`.

**Sea Tree** (4 skills): Dive (taught by Coral, 3 conch shells), Dash (Shift or the DASH button), Cannon Peck (taught by Ember, 3 powder kegs; hold the peck button, release), Sea Legs (no knockback on the ship deck, and strong currents can't push Pip). The Pirate outfit now also reveals underwater treasure.

**Enemies.** Snappy crabs (cove, caves, reef), gull pirates that swoop (peck or Cannon Peck sends them away for 10 seconds), jellyfish underwater, lava sparks on Volcano Isle. Lava sends Pip back to the last safe spot; hot springs heal.

**Quests (9).** Set Sail (Pinch), X Marks the Spot (Polly, 3 dig spots then a chest), Smugglers' Cave (Sam), Pearls for Coral and The Sunken Bell (Coral; need Dive), Warm Springs and The Seed Cannon (Ember), Light the Lighthouse (Keeper Gus: braziers in order sun, moon, star, wave), Squawkbeard's Treasure (Pinch).

**Boss: Captain Squawkbeard, 3 stages with checkpoints.** 1) he swoops at a marked spot and lands; peck him while he's down. 2) he throws barrels along the deck; Wing Flap blows them back at him. 3) a chase through the sky: Dash into him while dodging cannonballs (needs Dash and Glide). If the hearts run out Pip is fished out and retries only that stage. Winning gives 20 golden seeds, the Ancient Sky Map (`flags.skyMap`, for Phase 6), **Captain of the Seas (rank 9)** and a closing scene.

**Growth budget added by the seas:** quests 9 x 14 = 126, skills 4 x 5 = 20, trainings 2 x 8 = 16, ship upgrades 3 x 6 = 18: about 180. Running fixed total: 838 + 180 = 1018; rank 9 needs 850 (83%), rank 10 needs 1100.

**Seed budget:** sources: quest rewards 5+5+5+5+5+5+5+6+10 = 51, golden seeds 20, polly chest 6. Sinks: Sea Tree 24, ship upgrades 30.

**Tests.** `tests/seas.js` (with `tests/walk.js`): walks Pip from each dock to every pick-up, person, cave crate and underwater item; checks cave and dive warps, air, Dash, Cannon Peck, Sea Legs, enemies, every quest, ship upgrades, the lighthouse puzzle, all three boss stages, the chase, rank 9, the ending and the save round trip. Smoke, city and village tests still pass. **Not verified:** touch on a device (new DASH button), the music by ear, a human playthrough of the boss (difficulty), or how long the seas take.

## 0f. Phase 6 (Sky Kingdom): built (Oct 14, 2026)

```
Cloud Meadows (0,17)(1,17)      Floating Gardens (3,17)(4,17)      Cloud City rooms (3..7,21): boutique, star-fruit stand,
Cloud City    (0,19)(1,19)      Storm Peaks      (3,19)(4,19)      weather shop, Tweeta's cottage, sky nursery
Storm Dragon's lair (0,21)
```
The four areas are joined by **cloud stairways** (swirling portals with a label: GARDENS, CITY, PEAKS, LAIR, DOWN). The way in is a cloud stairway on the snowy peak, just east of Elda's nest.

**Story flow.** After Squawkbeard (flag `skyMap`) and Elda's egg quest, talk to Elda again: the egg hatches in a short scene, then the player **names the chick** (letter-grid screen, 10 letters or four presets, touch friendly). The chick (`NIMBLE` in the tests) then follows Pip everywhere, is the trainer for Dive-Bomb, and appears in the finale and credits. The cloud stairway then works. Win the Storm Dragon: flyover of every region, the whole of Chicklandia gathers at the farm, **Legend of Chicklandia (rank 10)**, credits with every friend, then free play (everything stays open; Stormy lives in the lair).

**Code map.** Data: `src/content/sky.js` (positions, pads, vents, portals, items, cast, buildings, Sky Tree II, outfits, foods, exhibits), `src/content/quests_sky.js` (9 quests, 3 trainers, 3 shops, talk). Regions: `src/regions/sky.js`. Systems: `src/systems/sky.js` (pads, vents, wind, rain walls, lightning, gate, chime puzzle, hatching, naming, hints, fly-map sky page), `src/systems/sky2.js` (the dragon, flyover, gathering, rank 10, credits, drawing of every sky thing). Art: `src/entities/sprites_sky.js` and 11 new tiles in `src/world/tiles.js`. Music: `src/engine/tracks_sky.js` (4 tracks; the lair uses `boss`). Save: `G.sky` (open, hatched, name, harvest counts, chimes, boss stage, crystals, nest, metBoss).

**Mechanics.** *Bouncy clouds* launch Pip along an arc (to another island, or straight up and down); you cannot be hurt while in the air; the cloud waits `bounce length + 30 frames` before it bounces again, so Pip can walk off. *Updraft vents* lift Pip to an island (needs UPDRAFT). *Wind lanes* push Pip sideways (the Cloud Scarf blocks it). *Thin clouds* (needs CLOUD WALK). *Cloud barriers* are cracked by a **Dive-Bomb**: bounce on a cloud, press peck in mid-air, slam down. *Storm crystals* (walls in the Peaks, and the boss's crystals) are shattered by **Thunder Peck** (a normal peck, once learned). *Rain walls* hurt and send Pip back (the Storm Cap blocks them). *Lightning* in the Peaks shows a glowing ring for about a second before it strikes.

**Sky Tree II** (4 skills): Updraft (5 seeds, no training), Cloud Walk (6; Zephyr; 3 wind chimes), Dive-Bomb (6; **your chick** teaches it; 3 pegs), Thunder Peck (8; Starla; 3 static bolts; needs Cloud Walk and Dive-Bomb learned). Training items are only spawned while a training is running, like the other trainers. (The spec asked for two trainer-locked skills with the hatchling as one trainer; here three are trainer-locked, Cloud Walk by Zephyr, Dive-Bomb by the chick and Thunder Peck by Starla, and Updraft is the free one, so the player can always reach the first islands.)

**Quests (9).** The Egg Hatches (Elda), Lost Lambs (Puff), Zephyr's Feathers (4 sky feathers on the islands; needs Updraft), Sky Seeds (Fern: grow and harvest one star-fruit and one moonflower in the sky soil; reward: Sun-Bloom Crown), The Garden Chimes (Fern: peck the chimes BIG, SMALL, MEDIUM), Star-Fruit Cake (Tweeta: 2 star-fruit), Window Display (Plume: 3 cloud puffs; then the Feather Boutique opens), Lightning Rods (Nimbus; 3 rods past the crystal wall; needs Thunder Peck), The Lonely Storm (Nimbus: the boss).

**Sky farming.** 24 soil tiles in the Floating Gardens are garden plots. Anything planted there grows 3 times as fast (moonflowers still only at night). New seed: STAR-FRUIT SEED (3 seeds at the stand; harvest gives 5 seeds and a star-fruit).

**Cloud City.** Five enterable buildings built on the Phase 3 machinery (`BUILDINGS`, `DOORS`, `roomCell`, `openCatalog`): Feather Boutique (Feather Quill outfit), Star-Fruit Stand (star-fruit seed, cloudberry, star cake, sky honey), Weather Shop (storm tea, rain charm, sunny charm, Storm Cap), Tweeta's Cottage (a home), Sky Nursery (baby birds and four nests Pip can sleep in).

**Boss: the Storm Dragon, 3 stages with checkpoints.** A lonely, grumpy cloud dragon. 1) Dodge his lightning for about 25 seconds (a bar fills). 2) Shatter the 4 storm crystals with Thunder Peck while the lightning keeps coming. 3) Ring the 3 sky bells by pecking them (or by a Dive-Bomb next to one) while he swoops across the arena (a red band shows where). Running out of hearts only restarts that stage. Winning calms him: he becomes Stormy, gives Pip his Storm Cap, and the finale starts.

**Darkness and weather decisions.** Meadows, Gardens and Cloud City get gentle nights (30% instead of 68% dark) and no rain. The Storm Peaks and the lair are always dim, with rain, and flashes. Cloud City interiors are lit like the city's.

**Perks for ranks 8-10 (new).** Rank 8: village gathering always gives +1 material. Rank 9: air lasts 50% longer underwater and sailing is 20% faster. Rank 10: +1 heart and Wing Flap recharges twice as fast. The golden aura was already drawn. **Fix:** the village and seas endings no longer force a rank-up that was already earned (`finaleRank(n)`).

**Museum and Journal.** Two new exhibits (Storm Shards, Cloud Blooms: 3 each), the museum room got 2 more cases. The Taste Log now has 17 foods, so the Journal is two sheets (press Z / A to flip): ranks + Taste Log, then secrets, scores and collections.

**Fly map.** A second page (press X / B on the map): the four sky areas, each unlocked when first visited. The ground page reaches the sky page the same way. The map button also works on touch.

**Growth budget added by the sky:** quests 9 x 14 = 126, skills 4 x 5 = 20, trainings 3 x 8 = 24, new foods 5 x 4 = 20, outfits 4 x 3 = 12, secret 6 (The Last Cloud), hidden seeds 8 x 2 = 16, museum exhibits 2 x 12 = 24: about 248, plus 1 per garden harvest. Running fixed total: 1018 + 248 = 1266. Rank 10 needs 1100 (87%), and the finale tops up whatever is missing.

**Seed budget:** sources: quest rewards 5+5+5+5+6+6+6+6+12 = 56, hidden seeds 8, chime chest 4, nest 3, museum exhibits 12, sky harvests 5 each (6 at rank 6+, 7 with the Sun-Bloom Crown). Sinks: Sky Tree II 25, star-fruit seeds 3 each, Feather Quill 5, foods 2-4, weather charms 2 each (the Storm Cap is a free gift from Stormy; it is also 6 seeds in the shop until then).

**Tests.** `tests/sky.js` (with `tests/walk.js`; 184 checks): regions and tiles; Elda, hatching, naming (presets, letters, erase, 10-letter limit, empty-name block); the hatchling follows; the sky gate; a **static reachability proof** (every pick-up, person, chest, soil tile, chime, door and portal is reachable with exactly the skills that should be needed, and the locked islands are NOT reachable without them); pads, vents, Cloud Walk, wind and the scarf, Dive-Bomb and the barrier, both chests, the secret nest, rain walls, lightning (hit and dodge), Thunder Peck through a save; the chime puzzle and sky farming; every quest, trainer, shop and Sky Tree skill; all three boss stages, the retry, the flyover, the gathering, rank 10 and the credits; free play; save round trip and loading an old (pre-sky) save; the fly map's two pages; every quest/grow/journal page rendering; darkness, rain and the minimap; the museum. Smoke, city, village and seas tests still pass. **Not verified:** touch on a real device (naming screen, X on the fly map, the peck button in mid-air), the music by ear, a human playthrough of the dragon (difficulty and fairness of the lightning), or how long the sky takes.


## 0g. Playtest fixes and economy rebalance (Oct 15, 2026; local, not committed)

From the first human playtest (see the playtest notes in section 7).

- **Closet (costume page).** With 17 slots in a 3-wide grid, the bottom rows ran under the detail panel. Now 5 across, 4 rows on screen (it scrolls), one sprite per cell, a gold ON badge, and a big name/description/bonus panel.
- **Detective Cap.** The notes page used to appear whenever the cap was owned, listed only 3 chapters, and nothing told you it worked. Now: wear the cap and the quest log opens on DETECTIVE NOTES (first page), listing every open task from every chapter (and new ones from friends you have met) with WHERE to find it; Up/Down scrolls; equipping shows a toast.
- **Growth.** Rank thresholds raised so a full playthrough of the content before a gate lands at about 90-95% instead of 120%: rank 5 210->235, 6 300->350, 7 390->420, 8 650->780, 9 850->960, 10 1100->1190 (ranks 2-4 unchanged). Snack bowl: 1 growth per 2 seeds, at most 8 growth a day.
- **Seeds.** Quest rewards are unchanged (the dialogue states them). Sinks up about 40-50%: Sky/Village/Sea/Sky II tree costs (e.g. Super Peck tree 21->30, village tree 25->34), coop upgrades 4/6/8 -> 6/9/12, buildings 4-6 -> 6-9, ship upgrades 8/10/12 -> 12/15/18. Sources trimmed: garden grows 50% slower (GROW 5400->8100) and yields plain 2 / giant 5 / moon 3 / star-fruit 4 (was 3/6/4/5), museum exhibits 5-6 -> 3-4 seeds, parcels 2 -> 1, watermill 2 -> 1 a day, Squawkbeard's chest 20 -> 12 seeds, Polly's chest 6 -> 4.
- **Also fixed:** the Village Tree and village quest page appear as soon as Bucky's village quest starts; a village friend whose letter went missing now gets a new one.
- **Not yet verified by a human:** whether the new numbers feel right. Tune the constants named above (the cost fields in `src/content/skills.js`, `coop.js`, `village.js`, `seas.js`, `sky.js`; the rank `gp` values in `src/content/ranks.js`; the snack bowl in `src/systems/ranks.js`; `GROW` in `src/systems/part2.js`).

## 1. Snapshot

| | |
|---|---|
| **What it is** | A Zelda-style, top-down pixel-art adventure. Pip the chick helps farm animals, grows by spending seeds on skills, learns to fly, then explores the world beyond the farm (Part 2) and builds a family coop. |
| **Files** | `chicklandia.html` and `index.html`. They are **byte-identical copies**. All code, art, music, and data live in one file (~2,750 lines, ~200 KB). |
| **Tech** | Plain HTML5 canvas + JavaScript. No libraries, no build step, no image or audio files. All art is drawn in code and all sound is synthesized live. |
| **Runs on** | Any modern browser, desktop or mobile. Double-click to play. The pixel font loads from Google Fonts; offline it falls back to a plain monospace font. |
| **Saving** | Automatic, to the browser's local storage, under the key `chicklandia_save_v2`. One save slot per browser/device. Older saves are migrated automatically (outfit renames, coop relocation). |
| **Version control** | None. The folder is not a git repo. |
| **Rough play time** | Part 1 is about 30–45 min. Part 2 is about 30–40 min. Not measured with a real player. |

## 2. How the code is organized

| Lines (approx.) | Section |
|---|---|
| 1–53 | HTML, CSS, touch-control markup |
| 54–125 | Constants, canvas scaling, palette, sprite helpers |
| 126–252 | Tile art (grass, water, buildings, interiors, part 2 terrain) |
| 253–674 | World map: 21 screens (7 rows × 3), legend, doors and exits |
| 675–849 | Character, item, outfit, and icon sprites; procedural chick generator |
| 850–965 | Audio: sound effects, 11 music tracks, rain loop |
| 966–1026 | Input: keyboard, touch controls, on-screen key-name swaps |
| 1027–1205 | Game state, save/load/migration, entity creation |
| 1206–1449 | Collision, effects, Part 1 quests and dialogue |
| 1450–1756 | Player actions (peck, hop, flap, push), entity AI, screen transitions, main update |
| 1757–2058 | World systems: day/night, weather, lighting, outfits and bonuses, shop, closet, minigames, secrets, sleep |
| 2059–2344 | Part 2: quests, trainers, coop, garden, followers, fly map, Part 2 intro |
| 2345–2421 | Growth tree, ending, title, fainting |
| 2422–2714 | Rendering (world, HUD, menus, bubbles, title, ending) |
| 2715–2755 | Main loop and debug hooks |

## 3. The world

```
          col 0            col 1             col 2
row 0   Coop yard   —   Barnyard     —    Orchard          (Farm)
row 1   Pond        —   Field        —    Big Fence        (Farm)
row 2   [Coop]          [Barn]            [Farmhouse]      (interiors)
row 3   [Burrow]        [Cellar]          Moonlit Grove    (secret areas)
row 4   Mountain Trail — Snowy Peak       [Your Coop]      (Part 2)
row 5   Forest Edge  —  Deep Woods   —    City Gate        (Part 2)
row 6   Sandy Shore  —  Tide Pools   —    Market Square    (Part 2)
```

- **Getting around:** dashes are walkable connections, and brackets are rooms you enter through doors, holes, or a fairy ring.
- **The hub:** the Forest Edge connects to the Mountains (north), the Beach (south), and the City (east, through the Deep Woods).
- **Flying:** in Part 2, press **F** to fly between discovered areas and back to the farm.

## 4. Progression at a glance

**Part 1 — The Farm**
1. Mama Hen's worm quest teaches pecking and gives the first seeds.
2. Seeds buy skills in the **Growth Tree** (8 skills, ending in Flight).
   - Hop needs Clyde's training.
   - Wing Flap needs Sir Cluckington's training.
3. Skills open new areas and quests. Ten animal quests give seeds.
4. Learning Flight and walking into the Big Fence plays the ending, then the Part 2 title card.

**Part 2 — Beyond the Farm**
1. Pip lands in the forest. The coop can be built for free right away.
2. Granny Shell teaches gardening. Sunflowers grow in about 90 seconds and harvest for 3 seeds.
3. Nine quests across 4 areas.
4. The **Sky Tree** has 4 skills. Swim needs Sandy's training; Super Peck needs Bucky's.
5. Coop upgrades unlock after 2, 5, and 9 quests and cost 4, 6, and 8 seeds. The family moves in, and level 4 adds a golden roof and a party.
6. **There is no Part 2 ending.** See the holes below.

## 5. Content inventory

**Quests (20 + 4 trainers)**

| Part 1 (farm) | Part 2 (beyond) | Trainers |
|---|---|---|
| Mama Hen: Breakfast Worms | Granny Shell: Acorn Hunt (unlocks gardening) | Clyde: Hurdle Training → Hop |
| Daisy: The Lost Bell | Bucky: Dam Builder (dam becomes a bridge) | Sir Cluckington: Wind Training → Wing Flap |
| Clyde: Carrot Crunch | Doe: Little Lost Fawn | Sandy: Lifeguard Training → Swim |
| Squeaks: Mouse Mail | Mo: Rockslide Rescue | Bucky: Stump Smashing → Super Peck |
| Penny: Hide and Seek | Elda: The Eagle's Egg | |
| Porkchop: Apple Snack | Pidge: Special Delivery | |
| Woolly: Fox Trouble | Remy: Super Soup | |
| Whiskers: Lost Yarn | Cap'n Pinch: Shell Seeker | |
| Biscuit: Buried Bone | Sandy: Turtle Rescue | |
| Mrs. Quackers: Lost Ducklings | | |
| Sir Cluckington: Golden Feathers | | |

**Skills (12)**
- **Growth Tree:** Fluffy Down, Quick Feet, Strong Peck, Hop\*, Tough Feathers, Flutter, Wing Flap\*, Flight
- **Sky Tree:** Swim\*, Glide, Super Peck\*, Golden Wings

\* needs trainer.

**Outfits (8, each with a bonus)**

| Outfit | Source | Bonus |
|---|---|---|
| Straw Hat | Shop, 2 seeds | Garden grows 50% faster; some pickups drop a seed |
| Astronaut | Shop, 2 seeds | Big light at night and in caves; moon hops |
| Cool Shades | Shop, 3 seeds | Outfits and coop upgrades cost 1 less |
| Ninja | Shop, 6 seeds | Fox and goose barely notice you; slightly faster |
| Pink Bow | Win Egg Catch | +1 heart |
| Bunny Ears | Win Carrot Bonk | Move 20% faster |
| Golden Crown | Cellar treasure chest | +1 seed per quest |
| Pirate | Win Firefly Catch | Hidden treasure and secrets sparkle |

**Other content**
- **Minigames (3):** Egg Catch (Penny), Carrot Bonk (Bun-Bun, in the burrow), Firefly Catch (Hootie, in the Moonlit Grove at night).
- **Secrets (3):** the rabbit burrow (under a leaf pile), the farmhouse cellar with a push-block puzzle, and the Moonlit Grove (a fairy ring that only works at night).
- **Characters:** 28 named characters plus decorative animals. Enemies: the fox and the grumpy goose, both on the farm only.

**World systems**
- Day/night cycle: one day is about 5 minutes. You can sleep in nests.
- Weather: clear, cloudy, rain, or storm. Rain makes puddles and speeds up garden growth. In the mountains it falls as snow.
- Lighting: a glow around Pip, plus lit windows, lamps, fireplaces, mushrooms, and fireflies.
- Music: 11 tracks that change by area and time of day.
- Touch controls: portrait and landscape layouts, a slide-able D-pad, and context-sensitive buttons.

## 6. Seed economy (as built)

| | Part 1 | Part 2 |
|---|---|---|
| **Seeds available** | 45 (37 from quests, 5 hidden, 3 from the chest), plus Crown/Straw Hat bonuses | 32 from quests, plus unlimited garden harvests |
| **Seeds needed** | 30 (all 8 skills), plus 13 for all shop outfits | 21 (Sky Tree) + 18 (coop upgrades) |
| **Notes** | Comfortable surplus. You can't get stuck by buying outfits. | Garden fills any gap. After everything is bought, **seeds have no use.** |

## 7. Holes and issues

**High priority: design holes players will feel**

1. **The growth tracker goes nowhere.**
   - The HUD title (*Teeny Peep → Little Chick → Growing Chick → Big Chick → Almost a Chicken*) is just "skills learned ÷ 2." It reaches *Almost a Chicken* when Part 1 ends and stays there forever.
   - Part 2 skills raise the level number but never change the title.
   - Pip never becomes "a chicken," the title is never explained, and nothing in the game reacts to it.
2. **Part 2 has no ending.** Finishing the 9 quests and the Dream Coop just shows a toast. There's no finale, credits, or sense of "you did it."
3. **No endgame for seeds.** Once the Sky Tree and coop are done, seeds pile up with nothing to buy. Garden harvests become pointless.
4. **Hearts don't matter in Part 2.** There are no enemies or hazards beyond the farm, so Tough Feathers, Golden Wings (+1 heart), and the Pink Bow do nothing out there.
5. **Trainers are invisible.** When Clyde, Sir Cluckington, Sandy, or Bucky has a training ready, nothing marks them (no **!**). Players learn about it only from a hint or by reading the locked skill in the tree.
6. **Training isn't in the quest log.** Training progress only shows inside the Growth Tree.

**Medium priority: bugs and inconsistencies**

7. **The seed counter overflows.** "Seeds found: X/45" also counts the Crown's bonus seeds and every Part 2 reward, so it can read 60/45. The Part 1 ending stats have the same problem.
8. **New Game overwrites your save with no warning.** Picking NEW GAME with a save present silently replaces it on the first autosave.
9. **Part 2 has no secrets or hidden seeds.** The Pirate's treasure sense and the Astronaut's light have almost nothing to do outside the farm.
10. **Faint dialogue can point off-screen.** After Mama moves into the new coop (level 2), fainting on the farm makes her "talk" from the coop interior, with the speech bubble pointing off-screen. This is rare, since enemies are only on the farm.
11. **The triplets can go to the wrong home.** If a triplet is found after the family has moved (coop level 3+), they go to the old farm coop instead of the new one.
12. **Maggie's shop is only on the farm.** Part 2 players must fly back to buy outfits.
13. **The minimap only covers the farm.** Part 2 areas show a text label only.
14. **No pause or settings screen.** There's no in-game list of controls, no volume control (only mute), and no save management.

**Low priority: polish and tech debt**

15. **Debug hooks are exposed.** `window.__chick` has `tp`, `step`, `talk`, and more. They're harmless, but players could cheat from the browser console. Remove or hide them before sharing widely.
16. **Two identical HTML files.** Every change has to be copied to both `chicklandia.html` and `index.html`. Better to keep one, or make `index.html` the only file.
17. **No version control.** Backups exist only as ad-hoc temp copies. A git repo would make experimenting safe.
18. **The title screen re-reads the save every frame.** It works, but it's wasteful.
19. **Golden Wings has no visual** beyond occasional sparkles.
20. **Tiny text on phones.** Some 5-pixel text is hard to read on small screens.

### Playtest notes (human playtest in progress, Oct 15, 2026; not yet acted on)

- **Costume page is hard to read** (the closet / outfit screen, key C). Needs a layout and legibility pass.
- **Detective Cap may not be working.** Its bonus is that the quest log shows WHERE each task is (the detective notes page and location lines). Needs checking in play.
- **Growth and seed economy are too generous.** The player is over full on both growth (rank gates fill early) and seeds long before the end of Phase 2. Needs rebalancing: GP values, quest and hidden-seed rewards, and the seed sinks. The budgets written for each phase (sections 0b-0f) assume the current numbers.

## 8. Testing status

| Area | Status |
|---|---|
| Every quest, trainer, minigame, secret, coop upgrade, fly travel, save migration | ✅ Verified with scripted playthroughs in the browser |
| Touch controls (portrait and landscape, D-pad, buttons, screen taps) | ✅ Verified with simulated touches on an emulated phone |
| Music and sound | ⚠️ Not heard. The test browser blocks audio, so only track selection was confirmed. |
| Real-device mobile play (feel, vibration, fullscreen) | ⚠️ Not tested |
| Full human playthrough timing and difficulty | ⚠️ Not done. All numbers are estimates. |

---

# Improvement Spec & Roadmap

This spec is written for the agent who will build the next versions. Read sections 1–8 above first; they describe the game as it exists today.

## Decisions already made (by the project owner)

- **Growth becomes the backbone of the game.** It gets a real growth meter, rank-up celebrations, and new ranks up to *Legend of Chicklandia*.
- **All three expansions will be built,** each about the size of Part 2.
- **The game will move out of a single HTML file** into a multi-file project.
- **Build order:**
  1. Phase 1: Foundation & Fixes
  2. Phase 2: Growth Backbone
  3. Phase 3: City Expansion (shops and homes you can enter)
  4. Phase 4: Expansion C, *Chicklandia Village*
  5. Phase 5: Expansion A, *Pirate Seas*
  6. Phase 6: Expansion B, *Sky Kingdom*

Finish and verify each phase before starting the next.

## Ground rules for every phase

1. **Audience is kids.** Keep the tone warm and silly, with no scary content. Dialogue lines should stay under about 110 characters each, and every quest needs a clear hint (from Mama, Granny Shell, or the quest log).
2. **Never softlock.** Everything a quest or skill requires must be reachable in the order the game allows, and seed costs must always be affordable from available sources. For each phase, write the seed budget (sources vs. costs) into this doc.
3. **Verify by walking, not teleporting.** The tide-pool bug (rocks sealed off a quest item) was missed because tests teleported Pip. Every new area must be checked by walking Pip there from a normal entrance.
4. **Saves must survive.** Bump the save schema version each phase and write a migration. A player must never lose progress, outfits, or seeds. Add a migration test that loads a save from the previous version.
5. **Art stays code-drawn.** Use the existing approach: the 16-color-ish palette `PAL`, `makeSprite()` with auto-outline, 16×16 tiles, and 256×224 internal resolution. No image files unless the owner approves.
6. **Every new interaction works on touch.**
   - Actions use the A and B buttons.
   - Every menu closes with ✕ ("back").
   - Any new text mentioning keys must go through the `tt()` key-name swap.
7. **Outfits:** every outfit keeps the "one bonus per outfit" rule. New outfits need a bonus that doesn't replace a skill.
8. **Day/night and weather keep working** in every new area. Decide per area: outdoor (weather and darkness), indoor (dim at night), or cave (always dark).
9. **Each new area gets its own music track** in the existing `TRACKS` format.
10. **Definition of done for a phase:**
    - It's playable start to finish, and old saves migrate.
    - Touch is verified, with no console errors.
    - Sections 1–8 of this doc are updated to describe the new state.

---

## Phase 1 — Foundation & Fixes

### 1A. Restructure the project (do this first)

**Why:** five more phases will add dozens of screens, characters, and systems, which won't fit in one 2,750-line file or a fixed 3-screen-wide map grid. Do this before the fixes, so they're made once in the new structure instead of twice.

**Requirements**
1. **Initialize a git repository** with a `.gitignore`, and commit the current game as the baseline.
2. **Split the code into modules** (plain JavaScript ES modules). Suggested layout:
   ```
   chicklandia/
     index.html              dev shell (loads src/main.js as a module)
     src/
       main.js               boot + game loop
       engine/               canvas & scaling, input, touch, audio, text/tt(), save & migrations
       world/                tiles.js, region loader, collision, transitions, lighting
       regions/              one file per region (farm.js, interiors.js, secrets.js, forest.js, city.js, ...)
       entities/             npc, items, enemies, followers, blocks, plots
       systems/              daynight, weather, garden, outfits, growth, minigames, flymap, trainers
       content/              quests/, dialogue/, outfits.js, skills.js (data, not logic)
       ui/                   hud, menus (grow, quests, shop, closet, map, settings), bubbles, title, endings
     tools/build.mjs         bundles everything into ONE file
     dist/chicklandia.html   the playable single-file build
     package.json            dev-only dependency (e.g. esbuild); NO runtime dependencies
   ```
3. **Keep double-click play.** ES modules don't load from `file://`, so development runs on a local server, while players get `dist/chicklandia.html`: one self-contained file with all JavaScript inlined. `npm run build` produces it, and `npm run dev` starts a local server.
4. **Replace the single big map grid with regions.**
   - **Region data:** each region (Farm, Farm Interiors, Secrets, Forest, Mountains, City, Beach, and every future area) has its own grid of screens, its own tiles, and a list of connections (screen edges, doors, warp tiles, fly-map destinations).
   - **Saving:** Pip's position becomes `{region, x, y}`. The migration must convert old saves, which store world `x, y` plus the current screen, into the right region and position.
   - **Keep world logic region-aware:** walkable-screen sets, interior detection, and area labels should all be properties of the region data.
5. **Move content into data files.** Quests, dialogue, characters, outfits, and skills should be data objects with condition functions. Adding a quest should mean adding a data entry, not editing game logic.
6. **Remove the duplicate `index.html`.** The single source of truth is `src/`, built to `dist/`.
7. **Put the test hooks behind a debug flag.** `window.__chick` (`tp`, `step`, `talk`, etc.) should only exist when the page is opened with `?debug=1`. These hooks are very useful for testing; keep and document them.

**Acceptance**
- The built file plays identically to today's version: same content, same feel.
- A save from the current version loads with all progress intact.
- `npm run build` works on a fresh clone.

### 1B. Fixes (from the holes list, section 7)

| # | Fix | Expected behavior |
|---|---|---|
| F1 | **Trainer markers** | A pink **!** shows above a trainer when their training is available but not started, and a **?** when it's ready to turn in. Use the same bobbing marker style as quests, but pink. |
| F2 | **Training in the quest log** | The quest log gets a **Training** section or page listing all 4 trainings with status: locked (with how to unlock), in progress (n/N), or done. |
| F3 | **Accurate seed counters** | Replace the single `found` counter with separate tallies: hidden seeds and quest rewards per part (without outfit bonuses), plus total seeds ever earned. The Part 1 log and ending show "Seeds found: X/45" counting only the 45 standard seeds. Part 2 shows its own total. Bonus seeds never push a counter past its maximum. |
| F4 | **New Game confirmation** | If a save exists, NEW GAME asks "Start over? Your saved game will be erased." with **Yes** / **No** (default No). |
| F5 | **Faint dialogue** | When Pip faints, only use Mama's line if Mama is on the current screen. Otherwise Pip says their own line, e.g. "Phew... back home. I feel much better!" |
| F6 | **Triplets' home** | A triplet found after the family moved (coop level 3+) goes to the new coop, not the old one. |
| F7 | **Hearts matter in Part 2** | Add light hazards (see the next table). Fainting in Part 2 respawns Pip at their coop if built, otherwise at the forest landing spot, with full hearts. The Ninja's stealth applies to these hazards. |
| F8 | **Part 2 secrets** | Add at least 4 hidden seeds (one per area) and one small secret spot per area (e.g. a hollow log in the deep woods, an ice cave on the snowy peak that the Astronaut's light helps with, a sand-mound stash on the beach, a rooftop garden in the city). The Pirate's treasure sense must reveal them. Add them to the Part 2 seed total. |
| F9 | **Part 2 minimap** | The HUD minimap shows the current region's screen layout, with visited screens highlighted (like the farm's). |
| F10 | **Pause / Settings menu** | **P** or **Esc** (keyboard), or a ☰ button (touch), opens: Resume, Controls (key and touch reference), Music volume, Sound volume, Text speed, Big Text (bumps 5-pixel UI text to 6–7 pixels), and Erase Save (with confirmation). Settings save separately from game progress. |
| F11 | **Golden Wings visual** | When learned, Pip's wing tips turn gold in the chick sprite generator, in every pose. |
| F12 | **Title screen performance** | Check whether a save exists once when the title opens, not every frame. |
| F13 | **Shop access in Part 2** | Temporary fix until Phase 3: Maggie also appears in the city Market Square with the same shop. Phase 3 replaces this with her city boutique. |

**F7 hazard ideas** (kept gentle and easy to avoid):

| Area | Hazard | Behavior |
|---|---|---|
| Forest | Grumpy bee swarm near 2 beehives | Chases Pip briefly if Pip gets close, then returns home. Wing Flap scatters it. |
| Mountains | Rolling snowballs on the trail | Roll down set lanes on a timer. Super Peck smashes them. |
| Beach | Snappy crabs | Scuttle side to side near the shells. Peck knocks them back. |
| City | No hazards | The city stays safe. |

---

## Phase 2 — Growth Backbone

**Goal:** Pip visibly grows up over the whole game. Growth comes from everything the player does, ranks are celebrated, and the climax of Part 2 is Pip becoming a **Grown-Up Chicken**. It also gives seeds and garden harvests a permanent purpose.

### 2.1 Growth Points (GP) and ranks

**HUD:** replace "LV n" with the rank name plus a thin growth bar showing progress to the next rank. The level number can stay on the Growth screen.

| Rank | Name | Growth needed | Story requirement | Where players should reach it | Visible change | Perk |
|---|---|---|---|---|---|---|
| 1 | Teeny Peep | 0 | — | Start | Current smallest chick | — |
| 2 | Little Chick | 40 | — | Early Part 1 | Size up | +5% movement speed |
| 3 | Growing Chick | 100 | — | Mid Part 1 | Size up, first comb | Hidden items twinkle when Pip is close (a weak version of the Pirate's sense) |
| 4 | Big Chick | 170 | — | Late Part 1 | Size up | +1 heart |
| 5 | Almost a Chicken | 230 | Learned Flight | End of Part 1 | Bigger comb, white wing tips | Fly-map travel is faster (shorter flying scene) |
| 6 | Young Chicken | 330 | — | Mid Part 2 | **New sprite stage:** white feathers mixing into the yellow, short tail feathers | Garden harvests give +1 seed |
| 7 | Grown-Up Chicken | 460 | Part 2 finale (see 2.4) | End of Part 2 | **New sprite stage:** adult chicken, mostly white with golden accents, full comb and wattle, tail plume | +1 heart; unlocks an accessory slot (see 2.5) |
| 8 | Village Hero | 650 | Village finale | End of Expansion C | Hero sash | Village perk (defined in Phase 4) |
| 9 | Captain of the Seas | 850 | Pirate Seas finale | End of Expansion A | Captain's tricorn badge | Seas perk (defined in Phase 5) |
| 10 | Legend of Chicklandia | 1,100 | Sky Kingdom finale | End of Expansion B | Golden aura, shimmering feathers | Legend perk (defined in Phase 6) |

**Thresholds and requirements**
- **Starting numbers:** these thresholds are starting points. Tune them so that ranks 5 and 7 land at the end of their parts with about 80% of optional content done.
- **Story gates:** a rank with a story requirement needs both the growth points and the story event. If the points are reached first, the bar shows **"FULL - ready to grow!"** and the hint system points to the story event.
- **Free-form ranks:** ranks without a story requirement trigger as soon as the points are reached.
- **Sprite stages:** the chick sprite currently has 5 size stages tied to skill count. Re-tie them to rank, and add two new adult stages for ranks 6 and 7. Ranks 8–10 add flair on top of the rank-7 adult sprite.

### 2.2 Where growth comes from

| Source | Growth | Notes |
|---|---|---|
| Completing a quest | 10 (Part 1), 12 (Part 2), 14 (later parts) | |
| Completing a training | 8 | |
| Learning a skill | 5 | |
| Taste Log: trying a food for the first time | 4 each | Worm, carrot, apple, acorn, fish, snowberry, cheese, plus new foods in later phases. Some foods need a "taste" action (see 2.3). |
| Winning a minigame | 8 first time, 2 after that | Repeat wins capped at 3 per in-game day |
| Finding a secret area | 6 | |
| Finding a hidden seed | 2 | |
| Getting a new outfit | 3 | |
| Coop upgrade | 6 | |
| Garden harvest | 1 | No cap. This is the long-term use for the garden. |
| Snack Bowl: eating seeds | 1 per seed | In both coops (see 2.3). This is the endgame use for seeds. |

**Budget check:** Part 1 sources should total about 260 growth (with Flight learned), and Part 2 about 250 more. Write the actual totals into this doc after building.

### 2.3 New interactions

- **Snack Bowl.** A bowl in the farm coop and in Pip's new coop. Peck it to feed Pip seeds, choosing **1 seed** or **5 seeds**, each giving +1 growth.
  - The bowl only appears after Flight is learned, so Part 1 seed pacing is unaffected.
  - Mama comments the first time: "Eat up, growing chick!"
- **Taste Log.** Foods that are already picked up (worms, carrots, apples, acorns, fish, snowberry) log the first time automatically. Quest items that get handed over (like Nibbles' cheese) count when Pip receives them.

### 2.4 Rank-up celebration and the Part 2 finale

**Rank-up event**
1. The game pauses and shows a starburst with a "RANK UP!" banner and fanfare.
2. Pip's old sprite morphs into the new one (a few frames of sparkle).
3. The new rank name and perk are announced.
4. If Mama or another family member is on screen, they react with a line. Otherwise a short "Letter from Mama" message appears.

**Part 2 finale: "The Coming-of-Age Festival"**
- **Trigger:**
  - All 9 Part 2 quests are done.
  - The coop is at level 4.
  - Pip has 460+ growth.
  - Pip talks to Granny Shell, who says it's time.
- **Scene:** a festival at the forest coop.
  - Every friend from Parts 1 and 2 attends.
  - Pip stands at the center, and the family speaks.
  - Pip transforms into a **Grown-Up Chicken** (rank 7).
  - A short credits roll, "Thank you for playing Part 2!", then a teaser for the Village: animals asking to move in near Pip.
- **After the finale:** play continues, and the save is marked as Part 2 complete.

### 2.5 Accessory slot (rank 7 perk)

At Grown-Up Chicken, the closet gets a second slot: **Accessory**.
- **What fits there:** small items such as bow, shades, ears, crown.
- **Bonuses stack:** an outfit and an accessory together can give two bonuses.
- **Starting assignment:** Pink Bow, Cool Shades, Bunny Ears, and Golden Crown become accessories. The rest stay outfits.
- **Drawing:** the outfit renderer must draw both pieces without them overlapping awkwardly.

### 2.6 UI

- **Growth screen:** a third page, **GROWTH JOURNAL**, showing:
  - the rank ladder with current progress
  - the Taste Log (food icons, with unfound foods as "?")
  - secrets found
  - minigame best scores
- **Save migration:** award retroactive growth for everything already done and apply the earned rank silently, with one summary "You've grown!" message on load.

---

## Phase 3 — City Expansion: Shops & Homes

**Goal:** turn the 2-screen city into a lively hub with shops and homes you can walk into. It should give seeds lasting uses, and it sets up the harbor for the Pirate Seas expansion.

### 3.1 New layout (about 6 outdoor screens + 10 interiors)

| Screen | Status | Contents |
|---|---|---|
| City Gate | Existing, reworked | Pidge, Rocco, the fountain. Add entrances to the Post Office and Rocco's den. |
| Market Square | Existing, reworked | Remy's bistro becomes an enterable building; market stalls. |
| Main Street | New | Maggie's Boutique, Seed & Feed, Bakery, Toy Shop |
| Residential Lane | New | 4–5 homes with lit windows at night |
| City Park | New | Pond, gazebo, bandstand; a good spot for the Library and Museum |
| Harbor Docks | New | Piers, boats, a lighthouse in the distance. Cap'n Pinch's ship is docked but "not ready yet." This is the Pirate Seas launch point. |

### 3.2 Shops (all use seeds)

A reusable **shop UI component** (generalized from Maggie's current shop) should drive every shop.

| Shop | Owner (new or existing) | Sells / does |
|---|---|---|
| **Maggie's Boutique (city)** | Maggie, moves here from the farm (a sign at the farm spot points to the city) | All current shop outfits, plus 2–3 new city outfits or accessories with bonuses (e.g. *Chef Hat*: +1 growth from Taste Log foods; *Detective Cap*: quest-log hints show which screen the target is on) |
| **Seed & Feed** | New: an old goat farmer | **Special seeds** to plant: **Speedy Sprout** (grows 2× faster, yields 2), **Giant Sunflower** (slow, yields 6), **Moonflower** (only grows at night, yields 4 plus a rare petal for the Museum). Also sells extra garden plots for the coop (2 more per purchase, up to 4 extra). |
| **Bakery** | New: a badger baker | Treats that are temporary buffs (one in-game day): *Corn Muffin* (+10% speed), *Seed Bun* (garden +25%), *Berry Tart* (+1 temporary heart). Treats also count as new Taste Log foods. |
| **Toy Shop / Arcade** | New: a ferret | Replay any minigame from here, plus one new minigame (see 3.4). Sells **Toy Tokens**: optional cosmetic flair such as Pip's nest decorations. |
| **Post Office** | Pidge's headquarters | **Daily Deliveries:** a repeatable job board with 1–2 delivery runs per in-game day to random characters (any region). Rewards seeds and growth, so it's a steady, gentle income. |
| **Library** | New: an owl librarian (Hootie's cousin) | Free hint books (one per area), the lore of Chicklandia, and a reading nook where Pip can "read" stories (flavor). The **Detective Cap** recipe could be a library quest. |
| **Museum** | New: a tortoise curator (Granny Shell's brother) | **Collections:** donate shells, feathers, fossils (new dig-mound finds), rare petals, and so on. Each completed exhibit gives a reward (seeds, growth, an outfit). This becomes a long-term collection goal across all regions. |

**Day/night:** shops are open during the day and show a "CLOSED – back at sunrise" sign at night. The Bakery opens early (from dawn).

### 3.3 Homes (each has a resident and a small quest)

| Home | Resident | Small quest idea |
|---|---|---|
| Rocco's Den | Rocco the raccoon | Return 3 "borrowed" items hidden around the city to their owners |
| Cleo's Apartment | Cleo the cat | Find her favorite sunbeam spot. A light-and-shadow puzzle using day/night: be at a certain spot at noon. |
| Remy's Bistro | Remy, plus Nibbles visiting | Cook-off: bring ingredients from 3 regions for a contest dish |
| Pidge's Loft | Pidge | Fix the pigeon coop's broken weathervane (rooftop, needs Glide) |
| The Duck Family Flat | Mrs. Quackers' city cousins | Babysit: lead 4 ducklings around the park and back without losing any |
| The Artist's Studio | New: a peacock painter | Pose for a portrait. Wear 3 different outfits on 3 visits. Reward: a painting hung in Pip's coop. |

**Night residents:** some residents are only home at night and out in the city during the day, so the clock matters here.

### 3.4 New city minigame

**Rooftop Race:** a timed run across city rooftops using Hop and Glide, collecting stars. Best times are saved. Winning gives a new outfit, e.g. *Racing Goggles* (bonus: +15% speed while gliding or flying).

### 3.5 Size and economy targets

- **Quest count:** about 6 home quests, the Museum collections, daily deliveries, and Rooftop Race.
- **Economy:** this phase adds lasting seed sinks (special seeds, plots, treats, Museum rewards). Write the seed budget into this doc.

---

## Phase 4 — Expansion C: *Chicklandia Village* (cozy builder)

**Size:** the same as Part 2, about 4 areas (8 screens), about 9 quests, 4 new skills, and one finale (rank 8, *Village Hero*).

**Premise:** after the Coming-of-Age Festival, friends from every region want to live near Pip. Bucky surveys a sunny meadow past the forest, and Pip founds a village.

**Areas**
| Area | Screens | Contents |
|---|---|---|
| Village Square | 2 | **Build plots.** Choose buildings to place: homes, a bakery branch, a mill, a bandstand, a school, a clinic. |
| Meadow Farmlands | 2 | Bigger fields, an orchard, crop rows, scarecrows |
| Riverside | 2 | Watermill, fishing spots, stepping-stone river crossings |
| Windmill Hill | 2 | Festival grounds; the kite contest uses flying and wind |

**Core systems**
- **Building:**
  - **Costs:** each building costs seeds plus materials (wood, stone, wool, clay) gathered around the village and older regions.
  - **Construction:** Bucky's crew builds it over a set amount of in-game time.
  - **Placement:** buildings go in fixed plots. Freeform placement is not required.
- **Residents:** characters ask to move in once a matching building exists and their wish is met (e.g. Porkchop wants a mud pond, Whiskers a sunny window). Each move-in is a short quest.
- **Village happiness:** a simple meter, raised by buildings, decorations, and finished wishes. Happiness thresholds unlock festival events and the finale.
- **Seasons:** the village cycles Spring, Summer, Autumn, and Winter, changing every few in-game days. Each season changes tile colors and crops, and has one festival contest:
  - **Spring:** egg race
  - **Summer:** kite flying
  - **Autumn:** giant pumpkin
  - **Winter:** snow sculpture

**New skills (Village Tree)**
- **Carry:** lift and move heavy materials and objects.
- **Whistle:** call a helper animal to do a task, such as a sheep delivering wool or the beaver hauling logs.
- **Green Wings:** flapping over a crop row instantly waters it, speeding growth.
- **Master Builder:** buildings finish twice as fast and cost less wood.

Two of these should be trainer-locked, following the established pattern.

**Finale:** the Grand Harvest Festival. Every resident celebrates, Pip is named *Village Hero* (rank 8), and Cap'n Pinch sails into the harbor with an old treasure map, setting up the Pirate Seas.

---

## Phase 5 — Expansion A: *Pirate Seas*

**Size:** the same as Part 2, about 4 islands (8 screens), about 9 quests, 4 new skills, and a **multi-stage boss**. Finale: rank 9, *Captain of the Seas*.

**Premise:** Cap'n Pinch's treasure map is stolen by **Captain Squawkbeard**, a seagull pirate king, and his gull crew. Pip sails out from the city harbor to get it back.

**Sailing**
- **Travel:** a ship travel screen, a simple top-down sea map, from the Harbor Docks.
- **Ship upgrades** use seeds plus salvage (sails, hull planks, a cannon that shoots seeds). Upgrades unlock farther islands.

**Islands**
| Island | Contents |
|---|---|
| Pirate Cove | Smuggler caves, a treasure-hunt quest, a crew of friendly retired pirates (a parrot, a sea turtle) |
| Coral Reef | **Underwater diving areas:** a new "underwater" screen type with an air meter, coral, and a sunken ship |
| Volcano Isle | Lava flows (hazard), hot springs, fire-safe paths |
| Lighthouse Rock | Light-the-lighthouse puzzle; the final approach to Squawkbeard's fortress |

**New skills (Sea Tree)**
- **Dive:** go underwater in deep water, with an air meter.
- **Dash:** a short burst of speed that slips past hazards.
- **Cannon Peck:** a charged peck that knocks enemies far back.
- **Sea Legs:** no knockback on the ship deck or in strong currents.

Two of these should be trainer-locked.

**Enemies:** crabs, jellyfish (underwater), gull pirates (swooping dives), and lava sparks. Hearts and armor matter here more than anywhere else.

**Boss: Captain Squawkbeard**, in 3 stages:
1. Swooping attacks on the fortress deck. Peck him when he lands.
2. He throws barrels. Wing Flap blows them back at him.
3. An airborne chase above the waves using Dash and Glide.

The fight must stay kid-fair: generous hearts, clear tells before attacks, and a checkpoint between stages.

**Finale:** the treasure is a chest of golden seeds and an ancient map of the sky. Pip becomes *Captain of the Seas* (rank 9). The sky map sets up the Sky Kingdom.

**Outfit tie-in:** the existing Pirate outfit gets a stronger role here, e.g. its bonus also reveals underwater treasure.

---

## Phase 6 — Expansion B: *Sky Kingdom*

**Size:** the same as Part 2, about 4 sky areas (8 screens), about 9 quests, 4 new skills, and a boss. Finale: rank 10, *Legend of Chicklandia*, plus final credits for the whole game.

**Premise:** Elda's egg finally hatches. The chick, whom the player names, follows the ancient sky map with Pip above the clouds, where a storm threatens the floating islands.

**Areas**
| Area | Contents |
|---|---|
| Cloud Meadows | Bouncy clouds, wind currents that carry Pip (a new terrain type) |
| Floating Gardens | Sky-farming with Moonflowers and starfruit; gentle puzzles |
| Cloud City | A city of birds with shops and homes, using the Phase 3 shop and home systems |
| Storm Peaks | Lightning hazards, rain walls, the Storm Dragon's lair |

**New skills (Sky Tree II)**
- **Updraft:** ride rising air to reach higher islands.
- **Dive-Bomb:** swoop down to break cloud barriers.
- **Cloud Walk:** stand on thin clouds without falling.
- **Thunder Peck:** a peck that clears storm crystals.

Two of these should be trainer-locked, with the hatchling as one trainer.

**Boss: the Storm Dragon,** a grumpy cloud dragon who is lonely, not evil. The fight ends in friendship rather than defeat, so it stays kid-friendly:
1. Dodge the lightning.
2. Clear the storm crystals.
3. Calm the dragon by ringing 3 sky bells.

**Finale:** the sky is saved. Pip, now a full-grown chicken, flies home over every region they've visited (a flyover montage of the farm, forest, city, village, seas, and sky). Everyone gathers at the farm, and Pip becomes the *Legend of Chicklandia* (rank 10). Final credits list every friend. A post-game "free play" stays available.

---

## Cross-cutting checklist for every expansion

- **Fly map:** every new region gets a node on the fly map.
  - Undiscovered regions show as "?".
  - The map may need panning, or a world-to-region two-level view, as it grows.
- **Hint system:** the hint system (Mama, Granny Shell, and a new per-region "guide" character) covers every new quest.
- **New content:** each region adds new Taste Log foods, Museum collectibles, at least one secret, hidden seeds, and 1–2 outfits or accessories with bonuses.
- **Darkness:** decide for each new area whether it's outdoor, indoor, or cave, so day/night and lighting behave.
- **Save migration:** each phase includes a migration and a test that loads a save from the previous phase.
- **This document:** update sections 1–8 at the end of every phase. Add the new regions to the world map diagram, the new content to the inventory, and the new seed and growth budgets.
