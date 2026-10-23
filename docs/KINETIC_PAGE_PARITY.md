# Kinetic Souls page-mode parity

> Segmented destruction prototype (2026-10-21): the shared Classic/KS2 adapter now uses sparse local holes, bounded physical chunks, detachable enclosed islands, frontmost nested page layers, and bounded replay geometry without changing either game's fighter or combat source. Adaptive/Deep pacing is page-only. Source pin: `b000403d12894765fb603f8bb4ea0752e478f978`. Mobile frame-time profiling remains open; see `DESTRUCTION_PHYSICS_ARCHITECTURE.md`.

## Product rule

The Classic and KS2 repositories are the source of truth for the fighters, Bestiary, theme choices, weapons, and match rules. Demo Day adapts those systems to a website-sized, reversible arena. It must not turn Kinetic Souls into an unrelated shooter wearing its name. A game-data option that cannot be made meaningful over a live webpage stays standalone-only or carries a visible `PAGE MODE` label.

## Current state

- Page mode renders fighters, Bestiary entries, team colors, theme backgrounds, combat, and weapons from the pinned Classic/KS2 source.
- The modifier UI now follows each game's actual user-facing catalog. Classic has 25 themes, 9 native modifiers, 8 environments, and KS2 has 37 themes, 9 native modifiers, and 11 arena environments. Both use the source game's four selectable weapon styles and version-specific Bestiary.
- Gravity Well, Time Distortion, and Chaos Vortex are available as clearly marked page-mode modifiers. Classic uses explicit adapter behavior; KS2 reuses its behavior system.
- KS2 Solar Flares, Magnetic Fields, and Void Storm are adapted to the document world and labeled `PAGE MODE`. Other values that exist only in the KS2 type union are intentionally not presented as player-facing choices.
- Page-native match rules include 1, 2, 3, or 5-minute matches (2 minutes by default), sides and NPC, match results, LoK Bounty, Shrinking Arena, page scanning, target damage, and reversible cleanup. Duration changes apply to the next match; Shrinking Arena follows the active match length. The sandbox panel shares the match's targets and physics.
- Completion events include elapsed time and configured match length. The shell validates variant, run ID, duration, result, score bounds, and timestamp before forwarding the personal record.
- The page-mode setup adds a next-match NPC-side selector. Player 1 starts opposite the selected NPC; controls, temporary Player 2 takeover, HUD counts, result totals, and run records all use the selected physical-side mapping. Standalone Classic and KS2 do not expose NPC-side selection; it is a page-world adapter rule.
- Current pinned source for page-mode setup, material, directional impact, low-effects, target-surface recoil, source-matched fighter impact flashes, layered page fractures, deterministic glass/media shards, paper crease/split breaks, stone seams/chips, and digital pixel tears: `0d26c004f798e65983937932995e86d2d25c4951`.
- The HUD now uses Kinetic's compact monospace visual language, separate Classic and KS2 accents, legible team scores, match time, and page-break chain feedback.
- Page targets use an explicit, shared material profile in Classic and KS2: media is fragile glass, text is paper, semantic panels are sturdy stone, and other page/creator objects are digital. Each profile changes effective impact damage, durability, and its three readable damage-stage labels; boss health still scales on top of the material rule.
- Hit cracks follow the incoming vector from fighter collisions, projectiles, chain blasts, and the boss pulse, and are clipped to the struck target's bounds. Dynamic creator props receive a bounded directional impulse; collision recoil uses the fighter's pre-bounce velocity.
- Settings offers Full and Low visual effects. Low reduces particle and shard counts to 30% and screen shake to 20% without changing damage, movement, or scoring. System Reduced Motion takes precedence: it disables shake, fighter flashes, moving debris, and shockwaves while keeping a static themed arena and readable damage marks.
- Stone panels draw a short, impact-directed dark seam with a fine raised edge and break into 3–5 compact, deterministic chips. Chips stay within the target bounds, move more slowly than glass, and reuse the capped debris pool and Reduced Motion handling.
- Digital targets draw a small seeded cluster of mode-colored pixel bars clipped to the damaged element. The latest hit adds a brief restrained scanline offset; Reduced Motion keeps the static damage bars and removes the animated offset. Low effects reduces the bar count.

## Drift prevention

The visible option lists in the games are the reference, rather than every value in a broad TypeScript union. `npm run verify:kinetic-parity` compares page-mode lists with Classic's actual settings arrays, KS2's settings maps and environment board, and verifies shared weapon styles, native modifiers, and labeled page adaptations. The Demo Day build runs this check before building the game bundles. If a source game's visible settings change, update the page adapter and this document in the same reviewed change.

The checker is intentionally a small source-catalog guard, not a claim that every option has identical semantics in a scrollable document world. New physics adaptations still need a behavior test and explicit status here.

## Full roadmap

The wider Demo Day roadmap lives in [DEMO_DAY_ROADMAP.md](DEMO_DAY_ROADMAP.md). Kinetic-specific work is ordered below.

### 1. Match setup and controls

- Map the standalone game's control names and behavior into page mode while preserving the two-team spawn loop and holding-to-spray input.
- Add an explicit match setup for Player versus NPC, local drop-in Player 2, NPC side, match length, and score target. NPC side and match length (1/2/3/5 minutes, 2 by default) are implemented as next-match settings; score target still needs a rule and completion-event field before it is shown.
- Make mouse, keyboard, touch, and assistive-technology controls share one input-state implementation. Handle pointer cancellation, lost focus, and restoration.
- Persist a small page-mode settings profile locally only after the new control layout is stable.

**Acceptance:** changing a match option changes the actual match, both teams can be controlled, touch and keyboard have equivalent actions, and the completion event accurately describes the selected rule set.

### 2. Destruction and combat

- Material-specific durability, impact response, and readable three-stage feedback now cover glass media, paper text, stone panels, and digital creator/page objects. Further test and tune against more real host pages before widening the classifications.
- Target cracks and creator-prop knockback use the incoming vector. Page-target contacts use a surface-normal impulse and eject fighters through the nearest edge if spawned inside a target; leaving contacts resolve without applying a second hit. Standard restitution is 0.9, matching both source games, and Bouncy uses the source 1.2 value. Recoil speed remains capped by the page-mode fighter speed limit. Full/Low visual intensity and Reduced Motion behavior are implemented.
- Fighters now receive the source games' three-frame flash when they strike a destructible page target, matching the existing fighter-on-fighter and projectile-hit feedback. Reduced Motion continues to suppress the flash at render time.
- Page targets keep up to six deterministic, bounded fracture maps instead of replacing the visible crack on every hit. Direction-weighted spokes, fine branches, a contact stress ring, and material-specific line profiles are rendered in the clipped damage overlay; the geometry uses the same Classic/KS2 match and remains cosmetic.
- Glass/media breaks now use deterministic triangle fans that tile the target perimeter before launch, reveal the arena through the broken area, and stay under the shared 180-shard cap. Reduced Motion skips shard travel while preserving the broken target state.
- Paper/text targets show a subtle clipped crease before break, then split into two deterministic complementary strips that shear apart. The pieces contain no captured copy; the page text remains in the original DOM for exact restoration. Reduced Motion skips debris motion as for other materials.
- Destruction prototype detail and material-by-material follow-up slices are tracked in [KINETIC_DESTRUCTION_PROTOTYPE.md](KINETIC_DESTRUCTION_PROTOTYPE.md).
- The proposed next physical layer is specified in [DESTRUCTION_PHYSICS_ARCHITECTURE.md](DESTRUCTION_PHYSICS_ARCHITECTURE.md): local solid cells, connected physical segments, optional 2.5D depth, and pooled pixel detail. It is not implemented yet; first prove a traversable local opening on starter/creator props before applying it to arbitrary page targets.
- Give fighters and weapons meaningful page-target interactions, including boss telegraphs, target knockback, chain reactions, and short hit-stop that respects reduced motion.
- Keep all edits in the overlay or its scene objects. Never mutate the host page's DOM to simulate damage.
- Add broader low-effects tuning for slow devices, including per-effect shake, particles, flashes, and mobile performance controls.

**Acceptance:** a player can identify which fighter hit which target, see damage progress, and restore the exact original page after the run. Low-effects and reduced-motion modes remain playable.

### 3. Creative tools inside the match

- Add a fighter-safe placement ghost, grid/snap controls, rotation/scale, and explicit prop health/material.
- Make rebuild, save/open, timeline, replay, and export controls show clear unsaved/saved status and errors.
- Keep replay data bounded, scrub only while paused or replaying, and export only user-selected stills or short clips.
- Keep uploaded media local/private by default; add project deletion and storage limits before account sync.

**Acceptance:** a placed object joins the same collision and damage world as the page; it can be moved, damaged, rebuilt, saved, reopened, and removed without altering the host site.

### 4. Cross-game progression

- Keep guest progress locally, then merge stable run and achievement IDs when the player signs into a Lok account.
- Add the cosmetic Rift Fragment as the first shared inventory item only after the account contract and both receiving game adapters are reviewed.
- Keep spendable currency and balance-changing rewards outside this bridge. Treat browser-reported scores as personal records until a trusted server receipt exists.
- Add cross-device achievements, recent runs, personal bests, and sandbox project metadata with account-level access controls.

**Acceptance:** duplicate guest/account records merge idempotently; users can read and delete their own projects; the item appears consistently in Demo Day, Survivor 616, and Kinetic inventories without affecting game balance.

### 5. Creator and streamer mode

- Add a streamer setup with explicit channel consent, OAuth handled by a trusted backend, connection status, and an always-visible kill switch.
- Start with bounded EventSub/chat events: sanitized display names, rate limits, allowlisted commands, capped spawns, and reconnect behavior.
- Add local preview mode so creators can test overlays without connecting a live channel.
- Only add bits, channel points, or paid effects after permissions, billing semantics, abuse limits, and creator-facing disclosures are implemented.

**Acceptance:** the streamer can disconnect immediately; malicious or high-volume chat cannot freeze the game; no event can award spendable currency or alter another player's account.

### 6. Creator monetization

- Pilot clearly labeled sponsor scenes first. After an ad display ends, use a separate game object for destruction.
- Keep ordinary gameplay available if no sponsor/ad exists. Keep ad display and combat hitboxes separate and never reward ad clicks.
- Consider a rewarded-ad network only after its format and account are approved for the use case, with caps, disclosures, and a separate reward ledger.

**Acceptance:** sponsor sessions are identifiable in run records, ad elements do not overlap controls or mislead players, and non-ad sessions remain complete.

### 7. Kinetic source additions

- For each new source-game release, compare its actual settings UI, controls, Bestiary, theme names, and core combat before changing page mode.
- Use the parity checker as the first gate; then mark each new option `native`, `page adapted`, or `standalone only` and implement or explain its fallback.
- Keep the full standalone Classic and KS2 games independently playable. Demo Day pins reviewed source revisions and records the exact revision used by previews.

**Acceptance:** a source update cannot silently remove or invent visible options; page-mode behaviors have a regression path for both variants.

## Release gates

1. Run `npm run verify:kinetic-parity`, both Kinetic builds, bridge tests, and the full Demo Day Vercel build.
2. Play both variants on desktop and touch, including version switch, match completion, creator minimize/reopen, page scrolling, content added after start, and restoration.
3. Check keyboard focus, reduced motion, contrast, embedded GSix sizing, and a browser without backdrop blur.
4. Test guest and signed-in persistence independently before enabling cross-device sync.
5. Test streamer and monetization pilots behind explicit opt-in flags.
6. Review the Vercel preview and source changes before any production merge or promotion.

No production promotion, live account write, external ad activation, or Twitch event subscription is implied by a successful preview build.

### Segmented creator media gate (2026-10-21)

Classic and KS2 page mode use the same version 1 cell field for uploaded media and page targets. Source revision `c0bf15b571654ef2fd847f2db531bd806046ed72` masks local image/video holes, samples owned frames on physical chunks, and clears temporary media on Rebuild/Restore. The local integrated browser build showed a carved uploaded image in each variant. This is page-adapter behavior; the standalone games' fighter art, combat, and saves remain pinned and unchanged. Next verify video frame movement, replay scrub/export, and Full/Low/Reduced Motion frame time before widening the contract.

The follow-up source revision `a619970a0883fd98b40a23bc7a2d6e8254d366df` ties local video playback to match pause/resume and samples at most 16 owned-video playback times with replay. The browser check used an eight-second WebM in both Classic and KS2: upload while paused stayed paused, resume played, pause froze, and scrub before/after upload hid/restored the video at a sampled time. Classic still export downloaded a PNG; KS2 Rebuild restored the video's visibility and Restore removed the temporary overlay and media. This does not yet prove a detached textured video chunk advancing on screen or measure mobile/Reduced Motion frame time.

Source revision `9673ebd67bd98e438fa9c47a73739cadb137b391` now saves bounded damaged-cell state and the owned-video time with the local creator scene. Classic reopened a paused video at its saved position before and after a full page reload; KS2 reopened the same local scene, and Restore removed its temporary media. A focused test covers the restored collision map and rejects malformed fields. The visual damaged-media reload and mobile profile remain open. The browser run also showed that a free creator video falls rapidly to the document floor on a long page, so the next creator pass should improve prop staging without changing fighter physics.

Source revision `a9114b244b3fe82cf8f4913a15776eeecb5a2b93` stages creator objects against a fixed local floor in document coordinates. A drag recalculates the floor; Rebuild and local save/open keep the intended placement. The local browser showed visible uploaded video settling within the current viewport in both Classic and KS2, including a second KS2 section after scrolling, instead of dropping to the bottom of the whole document. Restore removed the props. Touch drag and long-page performance remain separate release checks.

Source revision `126832b3cbea49d0c1983386fdae2d265e0b2888` makes nested page-aperture rendering respect the same frontmost child solidity as combat. Parent openings are clipped around intact child geometry, including surviving 16-pixel cells in a damaged child. The source-controlled layered page fixture launched both versions, showed page breaks, accepted a newly added element during the match, and restored the exact original nested panels. A controlled screenshot of an intact child above a broken parent and measured narrow/Reduced Motion frame profiles remain open.

### Held spawn input regression (2026-10-19)

Production `build.json` was pinned to source revision `9c68fcdb457131cba582307bf35fdf58a202d06b`, where the A/L keydown handler discarded all `event.repeat` events. The reviewed source now tracks each physical key from initial keydown to keyup and repeats the selected team spawn every 150 ms. A and L can run simultaneously; keyup, blur, pause, match completion, and page restoration clear held state. Pointer and keyboard holds share the tested interval scheduler. Regression tests cover repeated browser events, interval timing, both sides, and release. Standalone Kinetic controls are unaffected.
