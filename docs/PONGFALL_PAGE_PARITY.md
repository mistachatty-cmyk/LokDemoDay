# PongFall page-mode parity

This document tracks the work required before PongFall can be selected from **Wreck This Page**. Demo Day currently exposes the source-pinned complete game and a live source-backed selector preview; it does not claim to destroy the page in PongFall mode yet.

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

## Acceptance criteria

- PongFall appears as a Wreck This Page choice only when this adapter is implemented and verified; the full game stays independently playable.
- The recognizable source loop runs: the player returns a ball with mouse, touch, or W/S against the source NPC; glass cracks/breaks after misses; the arena falls; wall eyes react; PongFall scores and results remain intact.
- The live page is the play field. Targets come from visible document content and optional creator props; targets take damage when the adapted ball or effects reach them, and broken regions reveal the arena theme underneath.
- The adapter uses document coordinates for target identity and correctly handles page scroll, resize, lazy-loaded content, and safe rescans. UI marked `data-lok-nondestructible` never becomes a target.
- A single reversible overlay owns game canvas, target effects, and controls. Restore removes the overlay and observers and leaves the original DOM, styles, and scroll position intact.
- The target/object budget, frame pacing, reduced-motion and low-effects behavior are bounded and tested on desktop and touch layouts.
- Run and result events use a validated `pongfall` game key and stable run ID. Browser-reported values remain personal records; no currency or account writes are added in this slice.
- Existing PongFall source tests remain green; page adapter tests cover coordinate conversion, damage mapping, skip markers, resize/scroll, stop/restore, and bounded results.

## Remaining questions to resolve during implementation

- The source sim currently models two paddles and arena walls; determine whether page targets should be physical obstacles in the source world, destructible panels replacing portions of the shaft, or both. Prototype one visible target and keep source scoring separate from page-target damage.
- The source renderer uses a full-canvas fill and camera centered on the falling arena. Determine whether to expose a transparent/background render option upstream or compose a page-target mask in Demo Day without compromising legibility.
- The source game has audio and local settings. Page mode must honor Demo Day mute/reduced-motion settings and avoid competing with the host site's audio.

These questions have implementation acceptance criteria above and do not block the standalone catalog entry. Keep page mode labeled unavailable until the user-facing criteria pass.
