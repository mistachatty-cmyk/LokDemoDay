# Destruction physics: segments, chunks, voxels, and pixels

## Status and scope

**Prototype in progress, 2026-10-21.** The shared Classic/KS2 page adapter now has a bounded sparse cell field, matching local collision holes, material-biased stress spread, physical chunks, owned-media fragments, and Adaptive/Deep pacing. The source games keep their own combat loops. This document records the remaining gates before sharing the contract with Survivor 616 and PongFall.

### Implemented prototype and remaining gates

- `page-mode/segment-field.mjs` defines version 1 of the validated target-local `applyImpact` geometry boundary. Fields allocate on first hit, cap at 192 cells per target, and the adapter caps active fields at 16. Returned cells become openings in both canvas reveal and collision. A fast whole-rectangle contact path remains until the first cell opens.
- Connected newly removed cells form at most four moving chunks per impact and 48 active chunks in the match. Chunks use area-based mass, carry team ownership, push fighters, deal at most 3 HP once per fighter, and can strike another target once. Their geometry continues to simulate in Low and Reduced Motion; Reduced Motion omits their moving visual.
- Glass spreads stress broadly, paper favors a horizontal fiber, stone spreads very little, and digital remains square. The existing 180-debris and 350-particle caps remain. Adaptive preserves quick breaks on small targets and extends larger targets; Deep extends every target on the next match. Results and browser completion details name the active tempo.
- The live scanner now excludes links, buttons, form controls, editable content, marked protected nodes, and any container holding one of them. The browser check found and fixed a navigation-link case that the first scanner pass missed.
- **Nested layer slice:** page descendants now resolve collision before their ancestors, one contact per fighter per frame. A child opening shows a procedural surface color from the nearest surviving ancestor, and a parent opening shows the arena. This preserves the host DOM. It is an approximate parent surface rather than a pixel-perfect reconstruction of that ancestor's text or imagery.
- **Replay slice:** up to one sample per second retains removed-cell keys, broken areas, and physical chunk positions as copied data. The creator timeline draws openings and chunks from its selected sample; the initial sample hides future damage. Source fighter IDs avoid showing later spawns in earlier frames. Removed fighters cannot currently be reconstructed as full sprites after they leave the active source array.
- **Enclosed island slice:** after a local cut, a bounded flood fill walks solid cells connected to a target edge. A surviving component isolated from every edge detaches into the same capped chunk pool if its cells fit the per-target budget. The field rejects more than 4,096 potential cells before allocating the flood fill and never stores more than 192 active cells. This is a 2D structural approximation; material-specific internal anchors and bond strengths remain future tuning.
- **Owned-media slice:** local image/video uploads and creator props use the same removed-cell field for their visible mask and collision. The canvas draws solid parts in document coordinates, while a detached media chunk samples the allowed source image or current video frame with the object's `contain` placement. Replay copies only source IDs and offsets, never media bytes. Whole-target breaks hide the temporary media element; Rebuild removes its mask and Restore removes the temporary object. This does not sample cross-origin page pixels or YouTube frames.
- **Owned-video timeline slice:** match pause/resume pauses/resumes local uploaded videos, including uploads made while paused. A replay sample stores at most 16 stable target IDs and media times; scrubbing hides later uploads in earlier samples and seeks existing local sources. It stores neither frames nor file bytes. Export currently saves the overlay canvas and does not composite the intact host page or unbroken DOM video into the still.
- **Local scene reload slice:** a version 1 creator record copies up to 192 cells with stress and removed flags, restoring both collision and visible masks after validating material and target size. Owned video reopens from its private IndexedDB Blob at its saved time. Old records without these fields still open. Scene records do not include moving chunks or replay history.
- **Geometry burst:** `node games/kinetic-official/page-mode/segment-burst.bench.mjs` simulates 2,400 impacts over 600 sampled geometry frames, 16 fields, and the 48-chunk budget. On the development machine the p50 was 0.041 ms, p95 1.146 ms, max 3.256 ms for the geometry portion only. These values are machine-dependent and exclude fighter rendering, DOM scan, canvas draw, and device GPU work.
- **Still required:** full desktop/mobile frame-time and memory profiles; narrow and Reduced Motion browser gates; an authored nested/island and damaged-media visual fixture; a visible advancing textured video chunk; creator-prop staging on long pages; Survivor/PongFall adapters; opt-in voxel scene. These are not represented as complete by this prototype.

The goal is to make each hit change what the combat world *is*, not only how it looks. A fighter should be able to break a small hole, send a connected chunk flying, strike that chunk again, and pass through the resulting opening. The host page must remain readable and restorable.

## Baseline before the segmented prototype

| Scale | Current behavior | Missing behavior |
| --- | --- | --- |
| Target | One rectangle takes damage until the whole target breaks. | Local holes and surviving solid segments. |
| Fracture | Seeded, clipped marks accumulate at impact points. | Cracks do not yet weaken connected material or steer the next break. |
| Debris | Glass triangles, paper halves, stone chips, and digital blocks move and bounce against the document floor. The pool is capped at 180. | Debris does not collide with fighters, other chunks, or intact target edges. |
| Fine detail | Hit particles are capped at 350; digital targets have small pixel bars. | No persistent erosion field, dust trail, or material-specific secondary breakup. |
| Reveal | A damaged spot shows a small arena aperture; a destroyed rectangle reveals its whole area. | Aperture shape does not follow the actual missing material. |

Source: `games/kinetic-official/page-mode/main.ts` (`Target`, `damageTarget`, `breakIntoShards`, `updateEffects`, and `draw`). Geometry generators live beside it in `page-mode/`.

## One destruction event, four scales

1. **Surface stress, 8–24 CSS-pixel cells.** A hit deposits force and damage into a bounded local grid. Material bonds share a portion with neighbors. Repeated impacts weaken the same cells and can open a small hole before the whole object fails. An impact near an existing crack needs less force to separate that area.
2. **Physical segments, roughly 16–96 CSS pixels.** Connected cells form islands. A detached island becomes one moving body with area-derived mass, a center of mass, velocity, and spin. It can bounce off fighters or the arena floor and can damage another target under a capped secondary-impact rule. Only these segments participate in meaningful physics.
3. **Voxel-like depth, optional 2.5D.** On a user-owned image, starter map, or creator prop, render a small side face and depth shadow on a flying segment. The face follows the chosen arena theme and material. A true 3D voxel simulation is an opt-in later experiment; it should earn its cost in a browser benchmark before entering default page mode.
4. **Pixels and dust, 1–4 CSS pixels.** An impact sheds small color samples, grit, scanlines, or sparks. These are pooled visual particles, not independent rigid bodies. Uploaded media can supply actual pixels because the player owns the file. A live external page uses material colors and shapes instead of attempting to read the site's pixels.

The player should read the **large shape first**, then the material-specific fine detail. Hundreds of independent pixel bodies would create collision work without making the break more understandable. A few large physical islands plus a restrained particle field make the effect both deeper and clearer.

## Proposed target contract

The game adapter supplies an impact from its existing fighter or weapon system. The destruction world owns local geometry and returns gameplay-relevant changes. Keep the contract versioned before sharing it with another game.

```ts
type Material = "glass" | "paper" | "stone" | "digital";
type TargetSource = "page" | "starter" | "upload" | "creator";

interface DestructionTargetV1 {
  id: string;                 // local, stable for this run
  source: TargetSource;
  material: Material;
  bounds: { x: number; y: number; width: number; height: number }; // document space
  isProtected: boolean;       // game controls, preview cards, forms, sensitive pages
  seed: number;
}

interface ImpactV1 {
  targetId: string;
  tick: number;               // fixed simulation tick for replay
  localX: number;
  localY: number;
  directionX: number;
  directionY: number;
  impulse: number;
  damage: number;
  team: 1 | 2 | null;
  kind: "fighter" | "projectile" | "blast" | "debris";
}

interface ImpactResultV1 {
  stage: number;
  removedCells: number[];
  detached: Array<{ bodyId: string; cellIds: number[]; impulseX: number; impulseY: number }>;
  apertureRects: Array<{ x: number; y: number; width: number; height: number }>;
  didBreak: boolean;
}
```

Validate finite positions, dimensions, force, and target ownership at the boundary. `isProtected` is checked before allocating a grid. The game chooses score and KO rules from `ImpactResultV1`; destruction never creates a currency claim. Run IDs and target IDs are local to the page mode. Existing full-game save formats do not change.

## Simulation rules

### Local damage and structural bonds

- Allocate a sparse grid only when a target receives its first hit. Begin with cells near 16 CSS pixels, clamp each axis to 4–16 cells, and cap at 192 cells per target. Treat these values as starting budgets to measure, not final visual dimensions.
- Store cell health and four neighbor-bond strengths in compact arrays. Glass carries brittle bonds and long cracks; paper carries a strong fiber direction and tears along a seam; stone resists first contact but loses chips after concentrated force; digital cells split on a pixel-aligned grid.
- Deposit damage near the local impact with a bounded falloff. Bias propagation along the incoming vector and along cracks already present. Mark cells below threshold as empty. Flood-fill surviving cells from material-specific anchors after an impact, **not every frame**. A disconnected island can detach.
- Merge adjacent solid cells into rectangles or convex outlines for collision. Projectiles test the hit cell; fighters test only neighboring solid cells. A hole that is visibly open must also be traversable. The page element itself remains in the DOM; the overlay covers only removed cells with the selected arena reveal.
- The first prototype applies this to starter and creator props. Move to user-owned uploads, then eligible live page targets after exact restoration, scrolling, and protected-UI checks pass.

### Chunk physics

- Spawn at most a small number of physical islands per break. Mass follows area times a material density; force transfers through the actual impact point, creating rotation. Glass is fast and light, paper drifts and folds, stone is heavy with short travel, and digital blocks snap into small grid-aligned clusters.
- Use one broad-phase spatial index for fighters, intact segments, and active chunks. Filter contacts by category: fighters hit world chunks; chunks hit world bounds and selected targets; decorative pixels never enter the contact solver. A debris-on-debris interaction can be added only if a benchmark shows it helps gameplay.
- Clamp secondary damage and allow at most one chain-producing impact per chunk, so a cascade cannot turn one shot into an unbounded loop. Destroyed fragments can be kicked toward the other team; ownership and friendly-fire behavior should be explicit in Settings before affecting score.
- Existing source-game fighter bounce remains the reference. The page adapter owns chunk motion and target contact; changing the source games' core fighter collision law is outside this contract.

### Pixel and voxel rendering

- Give every material a distinct progression: first-hit stress, weakened outline, local opening, detached chunks, settling dust. Preserve the impact direction and team color through all stages.
- For user-owned image/video, texture *large* segments from the allowed media frame and add small sampled colors to the particle pool. Keep the video player and timeline independent of the fragment simulation. For YouTube and other cross-origin media, use a separate overlay and procedural colors; canvas readback is restricted when a source is not origin-clean. [MDN explains the canvas origin restriction](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image).
- Render voxel-like side faces on a few chunks using the existing canvas first. Evaluate WebGL instancing only when the number of similar visible meshes makes it useful; Three.js documents `InstancedMesh` as a draw-call reduction for repeated geometry. [Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html).
- Try a worker and `OffscreenCanvas` only after profiling the main thread. It can move canvas rendering work off the main thread, but the DOM scan and live page measurements still belong on the main thread. [MDN OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas).

## Boundaries and replay

- **Reversible page:** no real DOM removal, CSS rewriting, or pixel capture of arbitrary sites. The overlay tracks holes and moving pieces. Restore removes its canvas, shadow-root UI, listeners, and local target state. Rebuild resets the damage field and fragment pool.
- **Protected surfaces:** `data-lok-nondestructible`, controls, preview cards, forms, and sensitive pages cannot allocate damage cells or colliders. A segment crossing over a control remains visual there and cannot intercept its pointer events.
- **Document world:** target cells and chunks use document coordinates; render subtracts the current scroll position. A newly inserted element gets a fresh target ID and full strength. A resized element invalidates or remaps its field without moving the host DOM.
- **Deterministic replay:** seed from run ID, target ID, and impact index; record bounded impact events and target creation/resizing events. Replay reconstructs cells and chunks from those events at a fixed tick. Do not record every pixel. Pausing freezes the physics tick; Reduced Motion retains the final damage field while disabling decorative movement.
- **Physics engine choice:** start with the current adapter's 2D solver for the small capped chunk pool. If contact complexity or stability demands a new engine, compare the same scene against Rapier 2D. Rapier supports attached colliders and collision groups, which would let page UI and particle categories avoid unnecessary contacts. [Rapier colliders](https://rapier.rs/docs/user_guides/javascript/colliders/) · [Rapier collision groups](https://rapier.rs/docs/user_guides/javascript/collider_collision_groups/). Do not add the dependency before the benchmark.

## Prototype order and gates

| Gate | Playable result | Evidence required |
| --- | --- | --- |
| 1. Local segment field | A starter/creator prop develops a hole where it was hit; a fighter or projectile can pass through that hole. | Repeated-hit geometry, same seed/replay, collision and visual aperture agree, Rebuild/Restore exact. |
| 2. Physical islands | Detached chunks spin, fall, bounce against a fighter and the arena floor, then settle or expire. | Momentum direction and material mass visibly differ; chunk cap and secondary-damage cap hold under a burst. |
| 3. Media detail | An uploaded image breaks into textured segments with pixel dust; owned video segments continue showing allowed frames. | Local file remains private; pause/scrub/export and reload behave; no tainted-canvas failure. |
| 4. 2.5D finish | A few chunks have depth faces, impact shadows, and material-specific edge lighting. | Classic and KS2 themes still read correctly; narrow viewport remains playable; Low and Reduced Motion retain clear damage. |
| 5. Live page rollout | Eligible text/media/panels use local openings, with clear fallback where content cannot be sampled. | Preview cards and controls protected; long-page scrolling, newly added elements, match end, and Restore pass in both variants. |

For each gate, capture a fixed test scene on desktop and a narrow viewport, record frame time and active counts, and compare Full/Low/Reduced Motion. Initial performance targets are **at most 16 active damaged targets, 192 cells per target, 48 physical chunks, and the existing 180 visual-debris / 350-particle caps**. Tune these against measured low-end devices; visual density is allowed to drop before input or combat timing changes. A 60 Hz frame is 16.7 ms total, so destruction must consume only a fraction of it.

## Alternatives considered

- **One physics body per pixel:** detailed in still frames, but contact count, memory, and replay cost grow with media resolution. Use batched visual pixels and a few physical segments instead.
- **Screenshot and shatter every website:** would reproduce page text and controls in an overlay and runs into cross-origin canvas restrictions. Use procedural page material and user-owned media textures. The original page remains authoritative for reading and interaction.
- **Switch the whole page world to Rapier or 3D now:** would make source-game movement parity harder to prove and grow the bundle before the current segmented behavior is validated. Benchmark it at Gate 2 or 4 if the present solver cannot meet the measured goals.

## Product payoff

Players can carve paths through a page, change the fight by breaking a bridge or shield, ricochet a chunk into an enemy, then rebuild the scene and try a different angle. The same local damage model lets creators author fragile glass, fibrous paper, heavy cover, and digital tiles with predictable outcomes. Pixel detail makes those outcomes satisfying; the segment field makes them playable.
