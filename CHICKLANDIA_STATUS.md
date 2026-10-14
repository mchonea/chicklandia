# Chicklandia — Project Status

*Review date: October 14, 2026*

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
| 5 | Almost a Chicken | 210 | learned Flight | fly-map trip takes half as long |
| 6 | Young Chicken | 300 | | harvests +1 seed; new white-feather sprite |
| 7 | Grown-Up Chicken | 390 | Coming-of-Age Festival | +1 heart, accessory slot; adult sprite |
| 8-10 | Village Hero / Captain of the Seas / Legend | 650 / 850 / 1100 | later expansions | sash / badge / aura drawn already; perks later |

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
