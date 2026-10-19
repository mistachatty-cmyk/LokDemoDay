# PongFall page-mode parity

This document tracks PongFall's page-mode parity. Demo Day exposes the source-pinned complete game, a live source-backed selector preview, and a separate page adapter that runs the pinned PongFall simulation over the host document.

## Source mapping

Pinned source: [`mistachatty-cmyk/PongFall`](https://github.com/mistachatty-cmyk/PongFall) at `a3136c66efdc1612c67fade4277c88e6ca629f24`.

| Visible behavior | Source | Page adapter requirement |
| --- | --- | --- |
| Fixed-step rally, falling arena, paddle movement, NPC, scores, breakable glass, tears, and replay commands | `src/sim/world.ts`, `src/sim/ai.ts`, `src/sim/glass.ts`, `src/sim/replay.ts` | Reuse the simulation and source input commands; keep the source run deterministic. |
| Canvas drawing for the shaft, arena, paddles, eyes, glass, tears, and end states | `src/render/draw.ts`, `shaft.ts`, `wall.ts`, `eyes.ts`, `glass.ts` | Reuse the rendering vocabulary while drawing over the document without hiding healthy page content. |
| Player controls and touch behavior | `src/core/createPongFall.ts`, `src/core/controls.ts`, `src/core/controlsPanel.ts` | Preserve mouse/touch/W-S paddle movement, Space thrust, E power paddle, Z zoom, P pause, and restart; add a page-mode help/restore affordance. |
| Full-game setup/settings and local histories | `src/core/mainMenu.ts`, `settingsPanel.ts`, `src/host/standaloneHost.ts` | Keep the standalone game intact. Adapt only settings that work in a document world and keep page-mode records personal. |

The original mount creates its own full-viewport canvas, audio, listeners, UI panels, and fixed canvas camera. `render/draw.ts` paints an opaque `#0b0e14` background and arena. The selector preview therefore imports the pinned simulation and renderer directly instead of running an iframe or drawing a lookalike.

## Page adapter options

1. **Mount the complete game over the page.** Fast to wire, but the opaque background covers the website, and the standalone viewport coordinate system does not damage document targets. This does not satisfy Demo Day's page-arena contract.
2. **Use the source simulation with a Demo Day document-world adapter.** Keep the standalone game unchanged; connect the source sim, AI, controls, and visual systems to document-space page targets and the reversible overlay. This best matches the existing Survivor and Kinetic approach, but requires explicit coordinate and damage contracts.
3. **Build a separate PongFall-like page mini-game.** Easier to control, but duplicates or approximates the actual PongFall core loop. Do not present it as PongFall.

**Selected direction:** option 2. Start in Demo Day with a small adapter that owns page scanning, target lifecycle, pointer coordinates, and restoration. Reuse the pinned source's simulation and renderer wherever the existing APIs allow. If the source API cannot expose a specific collision or visual event without a small source change, document that gap and upstream only that bounded hook; do not fork PongFall's standalone gameplay.

### Page-world coordinate contract

`site/pongfall-page-world.mjs` defines the first tested boundary between PongFall's centered simulation and the host document. A run captures an origin in document coordinates and a positive display scale. Source simulation points map to `{ originX + x * scale, originY + travel + y * scale }`; document pointers and target rectangles use the inverse transform. `travel` is the source world's accumulated fall distance, so a fixed page element moves toward/through the simulation as the arena descends while its document position remains stable as the user scrolls. This helper deliberately does not scan or mutate the host page.

The renderer inspection found that omitting `renderWorld`'s initial full-canvas fill is insufficient for a page backdrop: `drawShaftBack` paints a full-width gradient and opaque silhouettes, and pause/game-over overlays shade the whole frame. `site/pongfall-page-compositor.mjs` now provides an explicit clipped draw contract: it projects damaged document targets into viewport apertures, bounds work to 180 visible apertures from at most 900 candidates, and calls the original renderer inside the clipped union. The source game's full-canvas fill and overlays are therefore constrained to the damaged regions. Partial reveals grow from the target center; completed targets reveal the full rectangle. Do not mount the whole standalone canvas or mark PongFall playable in the Wreck selector until this compositor is connected to real target damage and restoration.

## Acceptance criteria

- [x] PongFall appears as a Wreck This Page choice after the adapter is implemented and verified; the full game stays independently playable.
- The recognizable source loop runs: the player returns a ball with mouse, touch, or W/S against the source NPC; glass cracks/breaks after misses; the arena falls; wall eyes react; PongFall scores and results remain intact.
- [x] The live page is the play field. Targets come from visible document content; targets take damage when the source ball overlaps them, and broken regions reveal source PongFall arena rendering underneath.
- [x] The adapter uses document coordinates for target identity and rescans after page mutations; resize/scroll mapping and `data-lok-nondestructible` exclusion are implemented.
- [x] A single reversible overlay owns game canvas and controls. Restore removes it and its observers/listeners without changing the original DOM or styles.
- The target/object budget, frame pacing, reduced-motion and low-effects behavior are bounded and tested on desktop and touch layouts.
- [ ] Run results are visible in the overlay; account/game bridge persistence remains a separate integration requiring a PongFall-specific validated result protocol.
- Existing PongFall source tests remain green; page adapter helper tests cover coordinate conversion, safe target geometry, sensitive-page exclusions, and bounded compositor apertures. Full browser checks cover start, source-render reveal, live page targeting, and restore.

### Execution record — document/world coordinate contract (2026-10-19)

- **Source/pin:** PongFall source inspected at pinned `a3136c66efdc1612c67fade4277c88e6ca629f24`; no upstream gameplay change was needed, so the pin remains unchanged.
- **Decision:** define and test a reversible coordinate transform before connecting source controls or scanning targets. Source sim travel advances the document-space arena center; user scroll stays a presentation concern, not sim state.
- **Code:** `site/pongfall-page-world.mjs`, `scripts/pongfall-page-world.test.mjs`; integrated into `npm run test:bridge` and required in built output. The page chooser remains limited to Survivor 616 and Kinetic Souls.
- **Checks:** 4 focused tests passed; the full `npm run test:bridge` suite passed all 18 tests; `npm run verify:kinetic-parity` passed; integrated `node scripts/build.mjs` built Survivor, Kinetic, PongFall, both official Kinetic versions, and the page overlay, then verified all pinned routes and assets. Existing Survivor sourcemap and large-chunk warnings remain.
- **Browser:** the local integrated build opened the launch dialog with the full-game-only PongFall notice. The Wreck chooser exposed only Survivor 616 and Kinetic Souls. This confirms the unfinished page adapter is not advertised as playable.
- **Preview:** `https://lok-demo-g7rdaatb9-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `0a0c8f5b9adaa9f5922842c12486ae02779fb7d6`. Authenticated `vercel curl /build.json` confirmed all four source pins, including PongFall `a3136c66efdc1612c67fade4277c88e6ca629f24`; the new coordinate module and `/games/pongfall/` returned HTTP 200. Direct interactive preview access is protected; the equivalent integrated local build was checked in-browser.
- **Known limitation:** the transform is a contract, not yet called by a live page game. Source rendering paints an opaque shaft and overlays in multiple functions, so a safe page compositor still needs a bounded source-render contract and a target-damage/restoration adapter.
- **Next slice:** build an opt-in compositing seam that allows source background/arena art to appear only through damaged document targets, with source standalone rendering byte-for-byte behavior unchanged by default; test alpha/clipping before integrating ball collisions.

### Execution record — damage aperture compositor (2026-10-19)

- **Source/pin:** continued from PongFall `a3136c66efdc1612c67fade4277c88e6ca629f24`. No upstream source edits; `renderWorld` can be reused within an overlay canvas clip because Canvas 2D clips all of its fill, shaft, scene, pause, and end drawing.
- **Decision:** use a bounded union of viewport apertures over damaged page targets. This preserves ordinary DOM outside those apertures and keeps the standalone renderer unchanged. Reveal geometry is clipped to viewport; partial reveal scales around target center and complete damage reveals the full target box.
- **Code:** `site/pongfall-page-compositor.mjs`, `scripts/pongfall-page-compositor.test.mjs`, bridge test script, build-output requirements. The Wreck chooser still does not list PongFall.
- **Checks:** 5 compositor tests and all 23 bridge tests passed; Kinetic parity guard passed; full integrated game build and output verification passed. Existing Survivor sourcemap/large-chunk warnings and Windows shell warning remain.
- **Browser:** local production build loads with the PongFall full-game card and no page-mode catalog addition. This is a helper-only slice; source rendering has not yet been connected to a live target loop.
- **Preview:** `https://lok-demo-phyqrq6r5-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `d9cefa975e69a6727a54c0bd94c4fc4862ba8610`. Authenticated `/build.json` confirms PongFall pin `a3136c66efdc1612c67fade4277c88e6ca629f24`; the compositor module and `/games/pongfall/` returned HTTP 200. The Vercel preview is protected; the equivalent local integrated build was opened in the browser.
- **Known limitation:** document scanner, real reveal values, source sim integration, input mapping, teardown, and restoration are still absent. The aperture helper only consumes target geometry that a later adapter must obtain safely.
- **Next slice:** add a bounded safe page-target scanner contract with `data-lok-nondestructible` and sensitive-control exclusions, then feed its stable document rectangles into this compositor; test scroll, resize, and stop/restore lifecycle before exposing gameplay.

## Follow-up parity work

- Page targets currently take bounded damage from ball overlap and reveal the original render through a clipped aperture. They do not yet deflect the ball or alter PongFall's scoring; decide whether page props should become physical obstacles as a later parity slice.
- The page adapter reuses original PongFall rendering under a viewport clip; standalone render and simulation files remain untouched.
- Page mode is silent and applies PongFall's reduced-motion option when creating visual effects. A shared settings panel and full source modifiers are not yet wired into page mode.

### Execution record — PongFall live page adapter (2026-10-19)

- **Source comparison:** pinned PongFall `a3136c66efdc1612c67fade4277c88e6ca629f24` has a deterministic Classic loop, left player paddle, source AI on side 1, glass durability, score-to-24 match, falling world, reactive wall eyes, and rendering effects. The page adapter starts that source loop directly using `createWorld`, `stepWorld`, `feedFx`, and `renderWorld`; no standalone source files changed.
- **Implementation:** added `previews/pongfall-page.ts` with document-coordinate pointer mapping, touch-drag paddle input, W/S movement, Space thrust, E pinball, P pause, rematch, bounded rescanning, page target damage, source-art reveal through clipped apertures, and reversible teardown. Integrated the new **PongFall** choice in Demo Day's Wreck menu and bookmarklet, added stop/switch support, and kept the separate full game entry. Added `site/pongfall-page-targets.mjs` and four scanner tests for target bounds, non-destructible UI, and sensitive-page exclusions. Added the page bundle to integrated builds and deployment-output checks. The pinned source did not move.
- **Verification:** all 27 `npm run test:bridge` tests pass; `npm run verify:kinetic-parity` passes; `node scripts/build.mjs` successfully built all four pinned game sources and verified static output, including `pongfall-page.js` and scanner modules; `node --check` on app and bookmarklet plus `git diff --check` pass. Existing Survivor sourcemap/large-chunk and Windows child-process warnings remain.
- **Browser:** local built site shows three Wreck modes. Starting PongFall ran a live 0:0 Classic game with source NPC, showed depth increasing to 167 m and a page target damaged/revealed (1 / 12) while normal Demo Day remained behind it. RESTORE PAGE removed the adapter overlay and restored the page; the standalone PongFall full-game card remains available.
- **Record boundary:** the overlay shows the final source score and target destruction count, but does not emit an account or game-bridge record yet. Keep account sync deferred until a PongFall-specific validated result contract and receiving-side support are designed and tested; no account/database writes or rewards were added.
- **Next:** push this bounded adapter slice and inspect its Vercel preview. Then continue PongFall parity with target break feedback/physical interaction and mobile controls, while prioritizing the roadmap's remaining Survivor and Kinetic improvements independently.
