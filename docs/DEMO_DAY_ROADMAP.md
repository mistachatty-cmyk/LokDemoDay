# LoK Demo Day product roadmap

This is the repo-owned plan for growing Demo Day into a reusable creative-game system across the Lok ecosystem. The website itself is the main play field: the selected game's real combat loop runs over a reversible copy of the page, and studio objects join that same match world. Separate games keep their own repositories and remain independently playable.

## Principles

- A game choice launches that game's recognizable loop, not a loosely related mini-game.
- Demo Day is an adapter and host. Game repositories own their source combat, fighters, and native UI data; Demo Day owns the page-sized world, bridge, and cross-game product shell.
- The actual website remains readable and untouched. Page damage, layers, props, and restoration live in an overlay.
- A menu option is either implemented, clearly labeled as a page-mode adaptation, or linked as standalone-only. Avoid dead or pretend controls.
- Keep guest play useful. Account sync, streamer connections, and monetization are opt-in and have clear failure/disable paths.
- Add to other Lok projects through documented adapters and reusable UI guidance, not a forced visual style.

## Current foundation

- **Game hub:** Survivor 616, Kinetic Souls, and PongFall full-game choices; the first two offer live page combat. All three use source-backed, silent live previews and retain separate full-game routes.
- **Page combat:** reversible page overlay, two Kinetic versions, source fighters/Bestiary/themes, left/right team spawning, NPC opponent, match records, target destruction, and restore-page path.
- **Target material behavior:** page-mode adapters classify media, text, panels, and creator props into glass, paper, stone, or digital profiles. Profiles tune damage, durability, and hit-stage callouts consistently in Classic and KS2.
- **Directional impact behavior:** Kinetic page targets draw fracture branches along the incoming hit vector, clipped to the target; dynamic creator props receive capped directional recoil for fighter, projectile, chain, and boss-pulse impacts.
- **Fighter recoil:** Kinetic page impacts use the contacted surface normal and source-game restitution (0.9 standard, 1.2 Bouncy), resolve embedded fighters at the nearest edge, and do not damage on exit contacts.
- **Kinetic visual intensity:** Full/Low settings reduce page-mode particles, shatter debris, and shake; system Reduced Motion disables screen shake and moving decorative effects while preserving combat and static damage feedback. The segmented prototype adds physical chunks with visual motion suppressed in Reduced Motion.
- **Segmented destruction prototype:** Classic and KS2 share sparse local holes and collision, a bounded physical chunk pool, material-biased stress, and next-match Adaptive/Deep pacing. Nested page layers, bounded replay state, and owned-media texture masks are implemented; visual partial-layer acceptance, burst frame profiles, and the other game adapters remain Phase 2/3 gates.
- **PongFall page input:** the source touch-drag controls remain scroll-friendly in page mode; double-tap thrust and two-finger pinball now use bounded touch gestures that ignore controls, drags, and cancelled pointers.
- **Match setup:** Kinetic Settings offers 1/2/3/5-minute matches (2-minute default) and a next-match NPC-side selector; Player 1 spawns opposite the NPC. The chosen duration applies on rematch, Shrinking Arena follows the active timer, and validated completion records include elapsed/configured duration and physical NPC side.
- **Creative tools:** starter scenes, local image/video targets, movement, damage, pause, rebuild, local save/open, replay scrubbing, still/short capture, and a collapsible in-match panel.
- **Source parity guard:** `npm run verify:kinetic-parity` validates actual visible settings catalogs before the Demo Day build.
- **Docs:** [Kinetic page-mode parity](KINETIC_PAGE_PARITY.md), [page sandbox behavior](PAGE_SANDBOX.md), and the source-controlled `lok-ui` guidance document.

## Delivery sequence

### Phase 0 — Maintainable source parity — active

1. Keep source revisions pinned and update the root pin in the same change as each source change.
2. Keep the parity checker aligned with the actual user-facing game menus, not only wide type unions or internal experiments.
3. Keep a per-feature state: implemented, page adapted, standalone-only, or planned. Make unsupported behavior visible to players.
4. Add focused tests for match rules, scanners, bridge payloads, restoration, and each page-specific physics adaptation.

**Exit:** source updates fail the build if the page menu silently drifts; reviewed source revisions, docs, and previews refer to the same commits.

### Phase 1 — Complete match parity and onboarding

1. Match setup: opponent mode, NPC enable/side, team control, match duration, score target, and rematch rules. **Implemented:** selectable 1/2/3/5-minute Kinetic matches, with two minutes as the default; run records carry elapsed and configured duration, and Shrinking Arena scales against that duration.
2. Controls: consistent keyboard, touch, mouse/touch takeover, accessible focus, cancel/lost-focus handling, and a quick help panel using the real game terms.
3. Settings: source-mapped themes, Bestiary, weapons, modifiers, environments, display/effects, and accurate page-mode labels.
4. First-run onboarding: explain page damage, how to spawn, how to scroll, where settings live, and how to restore the page; allow dismissal and don't interrupt return players.
5. Result screen: show KOs, targets, run time, version, personal best, and the next useful action; keep records personal until verified server-side.

**Exit:** new visitors can start either game, understand how to act, complete a meaningful match, and restore the website on desktop and touch.

### Phase 2 — Better destruction, combat, and backgrounds

1. Target stages by material: paper/text, image, card/panel, and user prop. Keep a readable damage indicator and target health.
2. Use the selected game's real effects and theme rendering under broken regions. Preserve original page content in healthy areas.
3. Improve force transfer: impact direction, target recoil, fighter recoil, shatter clusters, debris lifetime, chain reactions, boss telegraphs, and recovery. The [segmented destruction architecture](DESTRUCTION_PHYSICS_ARCHITECTURE.md) defines the next gates: local holes with matching collision, a capped physical chunk pool, media pixels, and optional 2.5D depth.
4. Add bounded levels of visual intensity and reduced-motion behavior. Avoid effects that hide text, controls, or page context.
5. Treat long pages as a document world: targets and fighters use document coordinates; new or lazy-loaded content joins safely; page restoration returns scroll and styles.

**Exit:** combat outcomes are easy to read; effects remain smooth on mobile; the website can be fully restored after repeated scrolling and destruction.

### Phase 3 — Make the creative sandbox a real part of play

1. Build placement ghost, safe-zone previews, move/rotate/scale, undo, and erase for user-created objects.
2. Define a shared target adapter for website elements, starter scene objects, images, and user-owned video. A target has bounds, material, health, collision, source, and restoration policy.
3. Add more curated starter maps with authored objectives, bosses, and accessible color/contrast variants.
4. Make replay and timeline deterministic enough to explain a run; save only bounded event summaries or explicit local scene data.
5. Add export/shareable scene packages with clear attribution, file limits, and local privacy controls.

**Exit:** users can author, fight through, save, reopen, export, and delete a scene without the creator panel taking over the whole game.

### Phase 4 — Lok account and cross-game progression

1. Define a versioned bridge for start, pickup, completed run, and inventory claim. Validate `source`, origin, game ID, run ID, schema version, and bounds.
2. Save guest runs locally and merge by stable IDs on sign-in.
3. Add account-owned recent runs, achievements, personal bests, project metadata, and privacy/delete controls.
4. Prove one cosmetic item, Rift Fragment, across Demo Day, Survivor 616, and both Kinetic versions.
5. Add offline retry and conflict handling; keep each game's detailed saves and balance inside its own source repository.
6. Keep spendable currency out of browser-originated events. Add trusted receipts only when a server-authoritative source exists.

**Exit:** a user's cosmetic claim and achievements sync across devices and receiving games, merge safely, and remain isolated by account-level access policies.

### Phase 5 — Expand the game catalog

1. Publish a small game-adapter contract: game ID/version, preview, launch routes, input map, mode setup, target adapter, event bridge, and source revision.
2. Add a game only after its core loop is mapped to page targets and a separate full-game route remains available. **PongFall is now pinned and playable in the hub; its page arena adapter remains in development.**
3. Use feature flags or staged catalog entries for experiments; keep failed/experimental adapters out of the default list.
4. Reuse the `GameChoice` component and documented UI patterns where they fit the host project's interaction style.

**Exit:** adding a Lok game requires an adapter and review, not a rewrite of Demo Day's game hub or another game's main loop.

### Phase 6 — Creator and streamer integrations

1. Start with offline creator mode and a fake chat feed so scenes and commands can be tested safely.
2. Add Twitch sign-in and EventSub through a trusted backend; subscribe only to selected events and channels.
3. Offer opt-in chat names/enemies and allowlisted commands, with sanitization, rate limits, spawn caps, reconnect handling, and a visible kill switch.
4. Add channel-point/paid actions only after permissions, billing, abuse handling, and clear creator disclosures are proven.
5. Later evaluate other creator platforms through the same bounded event adapter.

**Exit:** creators can disconnect immediately; viewers cannot send arbitrary code, overwhelm the simulation, or affect account balances.

### Phase 7 — Sponsor and rewarded destruction pilots

1. Build sponsor scenes first, with clear sponsor labels and a separate breakable game object that appears after the display ends.
2. Never put normal display ads inside combat controls or reward ad clicks.
3. Keep ad display, rewarded session, and ordinary gameplay as distinct modes with separate records and reward caps.
4. Enable a network format only after the account and format have been approved for this use and policy-compliant disclosures/consent are in place.

**Exit:** regular gameplay remains complete with no ad; users know when a sponsor or rewarded format is active; clicks are never required for game rewards.

### Phase 8 — Ecosystem experience

1. Reuse Lok Music's existing player for MP3 playback and game soundtracks; respect mute, volume, autoplay, focus, and mobile behavior.
2. Use the ecosystem's existing localization system for all hub, studio, settings, error, achievement, and control strings. Add locale fallback and pseudo-localization checks.
3. Add sound-reactive effects as opt-in, with microphone permission only when needed and no raw audio upload by default.
4. Consider cross-page roaming on Lok-owned pages using same-origin BroadcastChannel; use an account-backed handoff for different origins or devices.
5. Explore community raids, authored anomaly maps, rebuild challenges, saved creations, and shared live scenes after core reliability and permissions are established.

**Exit:** audio/language features follow existing Lok conventions; cross-page movement has origin boundaries and a working opt-out; user-created projects remain private until shared.

### Phase 9 — Shared Lok design and accessibility system

1. Maintain tokens for typography, color, borders, spacing, game status, motion, and responsive safe areas.
2. Make controls native and keyboard/touch accessible; give animated previews pause/visibility behavior, accessible labels, and reduced-motion static states.
3. Keep each game recognizable. The reusable component API supplies structure, not a requirement to apply glass or a single skin everywhere.
4. Add visual regression captures for desktop, narrow/mobile, embedded GSix, high contrast, reduced motion, and browser fallbacks.
5. Document each reusable component's contract, lifecycle, and adoption guide for future Lok projects.

**Exit:** shared UI is easier to adopt and verify, while individual Lok games retain their own identity and navigation.

### Phase 10 — Release and reliability

1. Add error/health telemetry without collecting page contents or uploaded files.
2. Track frame time and object budgets; degrade particles and optional effects before gameplay becomes unresponsive.
3. Test complete real-browser playthroughs for both variants and all launch entry points.
4. Use Vercel previews per reviewed branch; verify actual generated assets and routes; keep rollback revisions recorded.
5. Separate preview testing from production promotion, account migrations, ad enablement, and Twitch subscriptions.

**Exit:** release artifacts, pinned game source, verification results, and rollback point are known before a production release.

## Execution order and gates

Current implementation work should follow Phases 0–3 first. Account, Twitch, and ad phases depend on a stable bridge and creator flow. Cross-page roaming and public sharing depend on privacy/ownership boundaries. The design-system work can proceed alongside gameplay, but only reusable pieces that have a tested contract should be generalized.

For every slice, record: source commit, feature status, code paths, test command, preview URL, browser steps, known limitation, and the next gate. This roadmap is the durable plan; update it when product scope or a dependency changes.

### Execution record — configurable Kinetic match duration (2026-10-19)

- **Status:** implemented on `codex/page-arena-destruction-physics` at source revision `bdbc9e4a2cd44be4e5f9aa4b47c94d47de3ecdd1`; pinned in `scripts/pinned-revisions.json`.
- **Code:** `games/kinetic-official/page-mode/main.ts`, `site/page-run-protocol.mjs`, `site/app.js`; duration protocol tests in `scripts/page-run-protocol.test.mjs`.
- **Checks passed:** `npm run verify:kinetic-parity`; `npm run test:bridge` (5 tests); Classic `npm run typecheck:page` and `npm run build:page`; integrated `node scripts/build.mjs`; output verification for all pinned game routes/assets.
- **Browser:** locally served production build showed all four labels and the next-match note. A two-minute Classic match completed at `00:00` with the selected one-minute setting preserved; its result offered “Rematch · 1 minute,” the rematch started at `01:00`, and switching to KS2 kept the configured one-minute duration.
- **Preview:** `https://lok-demo-ncutnfi4x-mistachatty-cmyks-projects.vercel.app` reached Ready; authenticated `/build.json` matched pin `bdbc9e4a2cd44be4e5f9aa4b47c94d47de3ecdd1`, and `/page-run-protocol.mjs` served the duration allowlist. Direct browser navigation is protected by Vercel login, so an interactive browser session on the remote preview remains unverified; the preview build itself and the identical local build were checked.
- **Known limitation:** this run did not wait through a second full one-minute KS2 match or test every length/Shrinking Arena combination. The shared timer and settings code is built for both versions; these longer combinations remain in the full playthrough gate.

### Execution record — Kinetic NPC-side mapping (2026-10-19)

- **Source evidence:** inspected the pinned Classic and KS2 source settings menus and core spawn loops. Their standalone visible settings do not provide a page-sized NPC-side option. The page adapter had an unused `npcSide` field but hard-coded NPC spawning to side 2, Player 1 to side 1, and result counts to physical left/right teams.
- **Decision:** keep NPC-side selection as a clearly labeled Demo Day page-mode setup rule, applied on the next match. Player 1 spawns opposite the configured NPC side; the configured side runs the NPC and allows temporary Player 2 takeover for 12 seconds. Standalone games and their main loops remain unchanged.
- **Status/source:** implemented and pushed on `codex/page-arena-destruction-physics`, source revision `a6ba2bf2928ef4003eb0ef4d78341fb32b4ec92f`; updated `scripts/pinned-revisions.json`.
- **Code/tests:** `games/kinetic-official/page-mode/main.ts`, `page-mode/team-sides.mjs`, validated `npcSide` in `site/page-run-protocol.mjs`, and `page-mode/team-sides.test.mjs`. Run parity, bridge/run protocol and score-mapping tests, Classic page typecheck/build, then the integrated build and browser checks.
- **Acceptance:** selecting left/right changes the next match's NPC spawn side and Player 1 side; hold/manual input on the NPC side transfers it to Player 2; results and run-record player scores remain consistent under either physical-side mapping.
- **Checks passed:** parity guard; seven bridge, run-payload, and team-mapping tests; Classic page typecheck/build; integrated Demo Day build and static-output verification for both Kinetic versions.
- **Browser:** in the locally served integrated build, changed the NPC side to Left and match duration to one minute while a Classic match was active; that match stayed on its original setup, ended with consistent Player 1/Player 2 totals, and offered a one-minute rematch. The rematch opened at `01:00` with NPC Left and Player 1 Right. Left-side input transferred NPC control to Player 2; after 12.5 seconds the NPC resumed. Repeated the side mapping, takeover, and handback in KS2; Restore Page removed the overlay and left the original site intact.
- **Preview:** `https://lok-demo-dmbq8mbve-mistachatty-cmyks-projects.vercel.app` is Ready. Authenticated `/build.json` reports `kineticOfficial` as `a6ba2bf2928ef4003eb0ef4d78341fb32b4ec92f`, and `/page-run-protocol.mjs` contains the configured-duration and NPC-side allowlists. Direct browser access is behind Vercel login; the same integrated build was interactively tested locally.
- **Next gate:** inspect the pinned Vercel preview artifact; continue Phase 1 score-target rules or Phase 2 damage behavior.
- **Next slice at that checkpoint:** proceed to a bounded Phase 2 damage behavior; the material-profile slice is recorded below.

### Execution record — material-aware target damage (2026-10-19)

- **Source evidence:** inspected the page adapter's scan, `damageTarget`, chain blast, and target rendering paths. Every element previously used one area-derived durability threshold and generic `CRACKED / BREAKING / UNSTABLE` stage labels; the pinned source games' combat is reused for fighters but has no document-material damage system.
- **Decision:** add a Demo Day page-world material contract, shared by Classic and KS2: images/video/SVG/canvas use fragile glass; paragraph and heading content uses paper; article/section/aside/nav use sturdy stone; other page and user-created targets use digital. Keep these rules in the adapter; don't alter standalone combat.
- **Status/source:** implemented and pushed to `codex/page-arena-destruction-physics` at `2daf1db87665a450b4998ceea0ed7e00d60e9cbc`; root pin updated in `scripts/pinned-revisions.json`.
- **Behavior:** material changes damage applied per hit, target durability, chain-blast transfer, and stage callouts. Boss durability still applies its existing multiplier after material classification.
- **Checks passed:** `npm run verify:kinetic-parity`; `npm run test:bridge` (11 tests, including material profiles); integrated `node scripts/build.mjs`, including Classic page adapter bundling and output verification for all pinned routes/assets. The first build attempt exposed the Windows shell-path requirement; rerunning with Git for Windows `usr/bin` available succeeded. Existing Survivor Vite sourcemap and large-chunk warnings remain.
- **Browser:** integrated local Demo Day build started Classic and KS2 page matches with their source fighters over the live page. Classic recorded 7 page breaks and 2 chains; KS2 recorded 11 page breaks and 5 chains. Both variants restored the original website view after overlay exit.
- **Preview:** `https://lok-demo-r0pxmorpb-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `6efa3c20a161dfc9ad29ad9a150860bd5b0f85a0`. Authenticated `vercel curl /build.json` reports official source pin `2daf1db87665a450b4998ceea0ed7e00d60e9cbc`; the protected `kinetic-official-page.js` bundle includes the new material-stage labels. Deployment protection prevented an interactive remote browser pass, so the same integrated output received the Classic/KS2 browser playthrough locally.
- **Known limitation:** semantic tag classification is a first profile, not a full browser-specific material engine. CSS-only backgrounds and nested element overlap can produce multiple candidates; classification tuning needs representative host pages and future telemetry-free frame checks.
- **Next gate:** inspect the Vercel preview's built pin and page bundle; then add impact direction to cracks/knockback and fighter recoil, or refine material candidates against inspected browser pages. Preserve reduced-motion/low-effects behavior and verify both variants.

### Execution record — directional target impacts (2026-10-19)

- **Source evidence:** the shared page adapter already applied fighter bounce-back and dynamic prop momentum, but target crack marks were radial and prop recoil used the fighter's velocity after it had already bounced. Projectiles, chain blasts, and boss pulses did not pass an incoming vector to the damage effect.
- **Decision:** carry a normalized incoming vector with each target hit, draw a central fracture and two branches in that direction, and apply a bounded directional impulse to dynamic user props. Read the fighter's incoming velocity before collision response. Standalone source gameplay remains unchanged.
- **Status/source:** implemented and pushed to `codex/page-arena-destruction-physics` at `bd9344cf382390aa2aab696aa094650208ef6009`; root source pin updated in `scripts/pinned-revisions.json`.
- **Acceptance:** cardinal and diagonal vectors remain normalized; invalid inputs use a safe fallback; prop impulse scales with force but is capped; Classic and KS2 show directional cracks and props move away along their impact vector; ordinary fighter knockback and page restore still work.
- **Checks passed:** 14 bridge/team/material/impact tests; Kinetic parity guard; Classic page typecheck/build; integrated Demo Day build and pinned-route verification.
- **Browser:** final local integrated build launched Classic and KS2, populated Neon Tiles/Sky Garden into each live match, confirmed combat/page-break counters advanced (Classic 1 break; KS2 6 breaks/4 chains), and restored the host page after each variant. The Creator panel remained attached to the match while targets participated in play.
- **Preview:** `https://lok-demo-p5509swg7-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `c63351a72d3c323372f1a9675fe27a373ee70198`. Authenticated `/build.json` matches source pin `bd9344cf382390aa2aab696aa094650208ef6009`, and the protected page bundle contains the updated effect labels and boss pulse logic. Deployment protection prevents a remote interactive browser pass; the same integrated build was played locally in both variants and restored after each.
- **Known limitation:** impact vectors are persisted per target's latest hit; hit-stop and player fighter impulses are not added in this slice. Prop impulse is capped, and crack marks are clipped to each element to avoid covering adjacent text.
- **Next gate:** inspect the preview artifact; then tune reduced-motion/low-effects handling and fighter recoil, followed by broader material behavior.

## Model and dependency note

The current parity catalog, source mapping, documentation, and adapter changes are well-scoped engineering work and do not require a higher-tier model. If a future slice requires reconstructing unshared game behavior across multiple repositories, designing trusted account/reward security, or evaluating Twitch/ad policy at launch, first document the question, inspected source, alternatives, and acceptance tests here. Use a higher-tier review only for that bounded decision; keep all findings in this repository so work survives a model change.

## Merge checkpoint and next destruction plan (2026-10-19)

### Merge checkpoint

- Kinetic source PR [#10](https://github.com/mistachatty-cmyk/K.Souls---Classic/pull/10) was merged to `master` as `381cfea7e0db3163d128b9f303e5ecf715163169`.
- Demo Day PR [#15](https://github.com/mistachatty-cmyk/LokDemoDay/pull/15) was merged to `main` as `669cb3ce0ae13a025e72431e8b64077eacaf3087` after the source merge. The hold-repeat fix is live at `demo.gsix.online`; its manifest reports Kinetic source `79bf2caaa713ee46a5b474003d49aeb69245730c`.
- Those release gates are complete. The following destruction slices are review-only until separately merged; no production promotion is part of the current work.

### Destruction work plan

The next milestone is material-specific break behavior on the existing page-sized Kinetic world. Keep the overlay reversible, retain source game combat unchanged, and build on the deterministic bounded fracture maps in `docs/KINETIC_DESTRUCTION_PROTOTYPE.md`.

1. **Visual baseline and crack legibility.** Capture the integrated local build at desktop and narrow mobile sizes with ordinary text, images, uploaded media, and all four target materials. Run the same short scripted impacts in Classic and KS2. Tune line contrast, clamp behavior, overlap, and Reduced Motion presentation against those captures. Acceptance: every fracture remains inside its target, readable text stays legible before the break threshold, and Classic/KS2 have equivalent damage geometry while retaining their own palette.
2. **Glass and media break slice.** On break, turn a glass/media target into a small deterministic set of clipped polygon shards from the existing fracture map. Give shards outward velocity from the impact point with a capped count/lifetime; reveal the arena through the removed target area. Keep the original page node untouched for Restore/Rebuild. Acceptance: repeated seeds produce the same shard layout; shard coordinates remain target-local; destruction and restoration work for image, video poster, SVG, and canvas candidates; reduced motion skips shard travel while preserving the final broken state.
3. **Paper/text slice.** Implemented as Prototype 0.3: a low-contrast crease precedes break; two deterministic, complementary paper strips shear apart without capturing page text. Browser confirmation and restoration remain in the release gate.
4. **Stone/structure slice.** Add a few chunky chips and short deep seams for section-like structures, with the current sturdy profile controlling the break threshold. Acceptance: chip count and impulse are capped; larger targets do not produce unbounded canvas work; low effects reduces decorative pieces without altering durability or score.
5. **Digital surface slice.** Add clipped pixel blocks and a brief local scanline offset for digital targets. Keep displacement inside the target and disable the offset under Reduced Motion. Acceptance: no flash covers the entire page, no page layout is mutated, and effects are stable at high device pixel ratio.
6. **Shared debris and physics budget.** After material-specific shapes have distinct silhouettes, route them through one bounded debris pool with target-local collision bounds, lifetime cleanup, and a global per-frame budget. Acceptance: particles cannot collide with protected Demo Day controls; caps hold with at least 30 simultaneous targets; returning to the page removes all overlay-owned bodies and listeners.
7. **Creator and replay integration.** Let the existing creator pause, scrub, rebuild, and export the material break sequence using deterministic seeds. Acceptance: replay produces the same final geometry; scrubbing cannot advance a live match; rebuilding restores both the overlay target state and host page view.

### Release gates for this plan

- Each slice has deterministic geometry/physics tests, `npm run verify:kinetic-parity`, relevant Classic and KS2 builds, and the full integrated build.
- Check the Vercel preview build artifact and its pinned Kinetic revision for each slice. Complete a local browser playthrough when deployment protection blocks interactive preview access; record that limitation rather than claiming a remote playthrough.
- Test mouse, keyboard, narrow viewport, and OS Reduced Motion. Physical touch remains a separate device gate.
- Do not merge the next destruction feature until source and Demo Day previews pass, page restoration is confirmed, and the visible break/rebuild path has been checked in both Kinetic versions.

### Execution record — glass/media fracture shards (2026-10-19)

- **Source comparison:** the existing adapter broke every target into small randomized rectangles. Glass/media crack marks were already target-local and deterministic, but the break burst did not resemble pane shards and changed between runs.
- **Change:** the shared Classic/KS2 page adapter now creates deterministic triangular glass/media panes around the hit. The polygons include each target corner, tile the target before motion, launch radially, and use white plus version-colored refracted edges. Low effects caps the burst; Reduced Motion skips shard motion while the target remains broken. Rebuild clears overlay debris. Paper, stone, and digital targets keep their existing break effects for later slices.
- **Source pin:** `games/kinetic-official` updated to `6b4cac76788e64928d3d69027ec5bc5d87632f4c` on `codex/page-arena-destruction-physics`, pushed. The root build pin and parity documentation now follow this revision.
- **Checks:** three geometry tests cover determinism, bounds, corner coverage, target-area coverage, triangle area, and invalid inputs. All 48 bridge tests pass; Kinetic parity passes; Classic page typecheck and page bundle build pass. The integrated Demo Day build passed after adding Git for Windows `usr/bin` to `PATH`; the first attempt hit the known `sh` preinstall-hook issue. Existing Survivor source-map/chunk warnings remain.
- **Browser:** the local integrated build returned `net::ERR_EMPTY_RESPONSE` in the in-app browser at `127.0.0.1:4173`; no match-level visual claim is made. Classic and KS2 source previews are Ready and return HTTP 200 through the authenticated Vercel CLI. Interactive playthrough remains open.
- **Preview:** `https://lok-demo-ot74gx17z-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `de0ae7464f87d95a4462cda2b54a1e468d358179`. Authenticated `/build.json` reports Kinetic pin `6b4cac76788e64928d3d69027ec5bc5d87632f4c`; `/kinetic-official-page.js` returned HTTP 200 at 151,727 bytes. The preview artifact matches the pinned source.
- **Next at that checkpoint:** visually validate the glass fan at desktop and narrow mobile sizes, then implement the paper/text crease-and-strip break. Both source and Demo Day PRs were subsequently merged at the checkpoint recorded above.

### Execution record — PongFall catalog and full-game entry (2026-10-19)

- **Source evidence:** PongFall is `mistachatty-cmyk/PongFall` at `a3136c66efdc1612c67fade4277c88e6ca629f24`. Its standalone site boots `src/core/createPongFall.ts`; the loop uses the deterministic `src/sim/world.ts` simulation, source AI, and the source renderer (`src/render/draw.ts`, `shaft.ts`, `eyes.ts`, `glass.ts`). Visible play includes a falling shaft, a two-sided paddle rally, breakable glass, wall eyes, and source mode/settings panels. The game's current mount assumes a dedicated viewport and draws an opaque background, so it cannot safely be represented as page combat by simply mounting the standalone canvas over a webpage.
- **Decision:** add the pinned standalone game to Demo Day's full-game catalog and build a separate, muted attract preview from PongFall's actual simulation and renderer. Keep page combat unavailable for PongFall until its document-sized world adapter is implemented; the hub explicitly says this adaptation is in development and hides the misleading page-combat route.
- **Status/source:** implemented in Demo Day on the current review branch; root source pin and Vercel artifact manifest identify the PongFall revision above. No gameplay source files were changed.
- **Code:** `games/pongfall` source submodule; `previews/pongfall.ts`; `scripts/build-previews.mjs`; `scripts/build.mjs`; `site/game-choice.js`, `site/game-choice.css`, `site/style.css`, `site/index.html`, and `site/app.js`.
- **Checks passed:** PongFall typecheck and 83 source tests; TypeScript check and esbuild bundling for the source-backed preview; Demo Day Kinetic parity guard and 14 bridge tests; integrated build and static output verification including the PongFall route; root `app.js` syntax and `git diff --check`.
- **Browser:** the local production build showed the third PongFall card and the full-game-only route note. Opening it launched the source game's own mode, difficulty, arena-count menu; Play entered its running game and exposed the source controls (Settings, controls, Music, Thrust, Pinball). The separate Wreck This Page picker still offers only Survivor 616 and Kinetic Souls.
- **Preview:** `https://lok-demo-kb65cb4ra-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `de970b6`. Using authenticated `vercel curl`, `/build.json` matched the PongFall pin above; the homepage app bundle contained PongFall, the shared choice module imports `pongfall-preview.js`, the preview bundle returned HTTP 200 at 54,892 bytes, and the PongFall route/JavaScript assets returned HTTP 200 with the correct `/games/pongfall/` base path.
- **Known limitation:** PongFall is selectable for the complete game and its preview is live, but it does not yet appear in the Wreck This Page game list. Its deterministic sim and renderer must be adapted to document-space targets, scroll, cleanup, and the reversible page overlay before that entry is accurate.
- **Next slice:** build and test the PongFall page-mode adapter from the pinned source. See [PongFall page-mode parity](PONGFALL_PAGE_PARITY.md) for source evidence, architecture options, and acceptance criteria.

### Execution record — PongFall document-world coordinates (2026-10-19)

- **Current gate:** Phase 1/2 page adapter groundwork. PongFall remains standalone-only; no Wreck This Page option has been added.
- **Source comparison:** pinned simulation stores arena-local coordinates and accumulated fall travel separately; page targets are document rectangles. The source renderer also paints a full-width shaft gradient, opaque silhouettes, and full-frame pause/end shading, so skipping its first canvas fill alone cannot reveal the host page.
- **Implementation:** added `site/pongfall-page-world.mjs` to map source points, host-page pointers, and document targets through a run origin, scale, and sim travel. It is included in bridge tests and required build output. The PongFall source pin remains `a3136c66efdc1612c67fade4277c88e6ca629f24`.
- **Verification:** 4 focused tests and all 18 tests in `npm run test:bridge` passed; `npm run verify:kinetic-parity` passed; `node scripts/build.mjs` built all pinned games and verified generated routes/assets. Existing Survivor sourcemap and large-chunk warnings remain. In a local production-build browser, PongFall opened the full-game-only dialog with the adapter-in-development note, and the Wreck chooser still showed only Survivor and Kinetic Souls.
- **Limit:** coordinate contract is not yet connected to a visible mode. Page rendering still needs a damage aperture compositor that can use original PongFall arena art without covering healthy website content; do not expose the page mode until then.
- **Next:** prove a bounded rendering/composition seam (or document that an upstream rendering layer API is required), then connect source ball impacts to reversible target damage and page restoration.
- **Preview:** `https://lok-demo-g7rdaatb9-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `0a0c8f5b9adaa9f5922842c12486ae02779fb7d6`. Authenticated `/build.json` retained the pinned PongFall source revision; the new module and full-game route both returned HTTP 200. Vercel browser authentication prevented an interactive remote pass, so the equivalent local integrated build received the browser check.

### Execution record — PongFall damaged-page compositor (2026-10-19)

- **Implementation:** added a bounded clipping helper that projects damaged document rectangles into viewport apertures and calls the pinned PongFall renderer only within their union. Partial reveal expands from each target center; fully destroyed targets open their full rectangle. Added 5 focused tests; bridge suite now passes 23 tests. Added the module to required deployment output.
- **Source pin:** unchanged at PongFall `a3136c66efdc1612c67fade4277c88e6ca629f24`; no standalone renderer modifications.
- **Verification:** parity guard passed; integrated build produced all game routes and outputs; local browser confirms PongFall remains standalone-only pending page adapter.
- **Next:** safe, bounded page-target discovery, stable document rectangles, scroll/resize behavior and reversible teardown. Continue to keep PongFall out of the page mode picker until source matches can damage host targets and restore the page.
- **Preview:** `https://lok-demo-phyqrq6r5-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `d9cefa975e69a6727a54c0bd94c4fc4862ba8610`. Authenticated `/build.json` retained the PongFall source pin; the compositor module and full-game route returned HTTP 200. The protected preview's equivalent local build was opened in the browser.

### Execution record — PongFall page mode launch (2026-10-19)

- **Phase:** PongFall catalog parity, live page play adapter.
- **Change:** added a standalone Demo Day page adapter around the pinned PongFall Classic simulation, AI, effects and renderer. It maps pointer/touch movement and page targets through document coordinates, scans a bounded set of visible page targets, damages them from source ball contacts, and reveals the source arena through clipped apertures. The native Wreck menu and bookmarklet now offer PongFall alongside Survivor 616 and Kinetic Souls. The standalone PongFall game is still a separate launch path.
- **Source pin:** unchanged at `a3136c66efdc1612c67fade4277c88e6ca629f24`; only Demo Day changed.
- **Checks:** 27 bridge/page-mode tests passed; Kinetic parity guard passed; integrated `node scripts/build.mjs` built all source pins and verified `pongfall-page.js` and target helper output; app and bookmarklet syntax checks and `git diff --check` passed.
- **Browser:** local production build exposed all three page choices. PongFall ran with the source NPC; depth advanced and a page target was destroyed/revealed. Restore removed the overlay while leaving the Demo Day document intact. Browser testing covered desktop layout; touch device behavior remains to be checked.
- **Limit:** page target contacts add visual damage without changing PongFall scoring or ball physics. The overlay shows end-of-match results but does not send account records. No database writes, rewards, ads, or Twitch integrations.
- **Launch-flow correction:** final review found the homepage PongFall card still hid its page-combat option. It now offers both page combat and the full source game, and PongFall is also in the quick game switcher. The browser check verified the home-card choice and that the page option launches the live overlay.
- **Preview:** `https://lok-demo-g0olwbf4i-mistachatty-cmyks-projects.vercel.app` is Ready for root commit `dc00e60a82902a51a553d0bfb09ad8d8f8e076dd`. Authenticated `vercel curl` confirmed all four source pins are unchanged, the homepage returns HTTP 200, and `pongfall-page.js` returns HTTP 200 at 68,192 bytes. Vercel's browser protection redirects to sign-in, so interaction was checked against the matching local production build.
- **Next:** continue bounded PongFall parity work on touch/scroll behavior and page-target feedback, then resume improvements for Survivor and Kinetic in their planned phases.

### Execution record — Kinetic page effects and Reduced Motion (2026-10-19)

- **Source comparison:** inspected the source-backed Classic/KS2 page adapter. It already froze part of the theme animation and suppressed shockwave drawing under system Reduced Motion, but still applied camera shake and animated debris, and its Settings had no low-effects mode.
- **Change:** added a tested Full/Low visual-effects profile shared by Classic and KS2. Low emits 30% of the decorative particles/shards and applies 20% shake. System Reduced Motion overrides the selection to zero shake and suppresses fighter flashes, moving debris, shockwaves, and ambient animation. Fighter motion, target damage, match rules, and scores are unchanged.
- **Source pin:** Kinetic source branch `codex/page-arena-destruction-physics`, commit `2ab8dc111f6e58cf7fd81c49af152b9608b2286b`, pushed. Demo Day pin updated; other game pins unchanged.
- **Checks:** 4 focused effects tests, 31 bridge tests, parity guard, integrated build, static asset output check, and `git diff --check` passed. First build attempt hit the known Windows `sh` PATH issue; retry with Git for Windows `usr/bin` succeeded. Existing Survivor source-map/chunk warnings remain.
- **Browser:** local integrated production build ran Classic, switched to KS2, showed Low selected in Settings across the version change, and showed live NPC/KOs/page-break counters. Restore Page removed the overlay. The browser test did not emulate OS Reduced Motion; the effects profile has unit coverage for that branch.
- **Preview:** `https://lok-demo-3d2fz7q3f-mistachatty-cmyks-projects.vercel.app` reached Ready for Demo Day commit `cea90525e44370b96c3ad483b7d3f29e35511648`. Authenticated `/build.json` reports Kinetic source `2ab8dc111f6e58cf7fd81c49af152b9608b2286b`; `/kinetic-official-page.js` returned HTTP 200 (146,605 bytes) and includes the Full/Low selector and Reduced Motion profile. Deployment browser access remains protected; the matching local integrated build was interactively checked through Classic, KS2, Low selection, live match counters, and Restore Page.
- **Next:** continue Phase 2 with bounded fighter recoil tuning, or test/tune the existing material profiles against another representative page. Touch and OS Reduced Motion end-to-end checks remain in the broader release gate.

### Execution record — Kinetic surface-normal fighter recoil (2026-10-19)

- **Source comparison:** inspected Classic's and KS2's visible live combat loops. Both use surface-normal fighter collision response with restitution `0.9`, raised to `1.2` in Bouncy arenas. The page adapter instead reversed fixed X/Y velocity components, damaged targets even when a fighter was leaving, and could leave a spawned fighter inside a large page target.
- **Change:** the shared Classic/KS2 page adapter now resolves a fighter against the target's nearest surface, reflects only velocity entering that surface, caps recoil at the configured fighter speed, and separates the fighter from the target. If a fighter starts inside a target, it exits through the nearest edge. Leaving contacts do not trigger another damage hit. Damage, KO, and team scoring rules remain as before.
- **Source pin:** Kinetic source branch `codex/page-arena-destruction-physics`, commit `e89dc0b85ed3693d18fe113fa39831026cb2dcd3`, pushed. Demo Day pin updated; no other game source changed.
- **Checks:** 8 impact-physics tests, all 36 bridge tests, Kinetic parity guard, Classic page adapter bundle, and integrated build passed. Existing Survivor source-map/large-chunk warnings remain.
- **Browser:** local integrated build launched Classic and KS2 page matches with live NPCs. Classic showed page breaks and chain feedback; KS2 spawned both teams and advanced its live NPC counters. Low effects remained selectable in KS2 Settings. Restore Page removed each overlay. A 390×844 mobile viewport showed the settings panel and both spawn controls without horizontal overflow; selecting a side control advanced the live match. This was pointer input at a mobile viewport, not a physical touch-device test. OS Reduced Motion also remains unverified end-to-end; effect and collision behavior has focused unit coverage.
- **Preview:** `https://lok-demo-9fw8k4xvc-mistachatty-cmyks-projects.vercel.app` reached Ready for Demo Day commit `68d85cebdcbc57c3a690341c075a1f0c8c6304ec`. Authenticated `/build.json` reports Kinetic source pin `e89dc0b85ed3693d18fe113fa39831026cb2dcd3`; `/kinetic-official-page.js` returned HTTP 200 (147,447 bytes), with the same SHA-256 as the locally built adapter. The protected preview disallows interactive browser access; local final-build playthrough covered both variants, Low selection, and restore.
- **Next:** verify Low/Reduced Motion in a browser configured for OS Reduced Motion and test actual touch input on a device; then continue PongFall touch/scroll parity and page-target feedback.

### Execution record — PongFall page touch gestures (2026-10-19)

- **Source comparison:** PongFall source `createPongFall.ts` uses a double tap within 300 ms and 90 CSS pixels to thrust, and a second concurrent touch to activate pinball. Its standalone canvas disables touch gestures; the website adapter must preserve native page scrolling instead.
- **Change:** added `site/pongfall-page-input.mjs` to map a clean double tap to thrust and a two-finger chord to pinball. Interactive site controls and Demo Day UI are excluded; movement, single taps, cancellation, and mouse events cannot become actions. The page keeps default touch behavior, so scrolling stays enabled. The HUD now explains both gestures.
- **Source pin:** PongFall gameplay remains unchanged at `a3136c66efdc1612c67fade4277c88e6ca629f24`; its required repository handoff is recorded in documentation-only review-branch head `65699c19c2a464e2c21d659984da93a985424fd3`. The root build pin follows that branch head; no source gameplay files changed.
- **Checks:** 6 focused gesture tests and all 42 bridge/page-mode tests passed; Kinetic parity guard and full integrated build passed. Output verification confirms `pongfall-page-input.mjs` and the source-backed page bundle are included.
- **Browser:** local 390×844 viewport launched PongFall, scrolled the host document to `scrollY=866` while the fixed HUD stayed at `top=12`, and restored the original document. The screen showed the updated gesture help. Pointer interaction at a mobile viewport is not a physical touch test; touch mechanics are unit tested, and hardware testing remains open.
- **Preview:** `https://lok-demo-jdtt0by37-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `f11c2424a012177d29d5bb856b61716bc72d8d76`. Authenticated `/build.json` reports PongFall pin `65699c19c2a464e2c21d659984da93a985424fd3`; `/pongfall-page.js` returned HTTP 200 at 70,880 bytes.
- **Next:** improve page-target hit and break feedback as an independent code slice. Test the touch gestures on a physical device during the broader mobile release gate.

### Execution record — Kinetic page-target combat flash (2026-10-19)

- **Source comparison:** Classic and KS2 both assign a three-frame fighter flash on combat hits. Demo Day already applied that feedback for projectile hits but omitted it when fighters struck destructible page targets.
- **Change:** the shared Classic/KS2 page adapter now triggers the same brief fighter flash when an entering fighter collides with a page target. The existing Reduced Motion render gate still suppresses animated flashes.
- **Source pin:** Kinetic source branch `codex/page-arena-destruction-physics`, commit `07c238790469f235af9217fef16d66d33bd222f7`, pushed. Demo Day pin updated; other game pins unchanged.
- **Checks:** all 42 bridge/page-mode tests passed, the Kinetic catalog parity guard passed, the full integrated build produced all four game entry points and the page adapter, and `git diff --check` passed.
- **Browser:** the local integrated build loaded and exposed the Kinetic choice card, but browser clicks did not open the launch dialog, so the specific hit-flash cue was not visually confirmed this run. Both variants use the same tested adapter path; interactive browser verification remains open.
- **Preview:** `https://lok-demo-4jfjgc7h7-mistachatty-cmyks-projects.vercel.app` reached Ready for Demo Day commit `bd4af42d4a295c1a3651129fedcd7db4be45eb35`. Authenticated `/build.json` reports Kinetic source pin `07c238790469f235af9217fef16d66d33bd222f7`; `/kinetic-official-page.js` returned HTTP 200 at 144,000 bytes. Preview access remains deployment-protected; no remote interactive playthrough was performed.
- **Next:** continue Phase 2 with bounded target feedback improvements, then run actual Reduced Motion and physical touch device checks during the release gate.

### Execution record — Kinetic destruction detail prototype 0.1 (2026-10-19)

- **Source comparison:** the Classic and KS2 source renderers provide per-fighter hit flashes and pixel-art rendering, but the shared page adapter previously replaced the target crack with one new three-branch mark on every hit. That hid impact history and made destruction read as repeated hits rather than a growing fracture.
- **Change:** added `page-mode/fracture.mjs`, a seeded fracture generator bounded to the target rectangle. Each page or creator target records at most six impacts, with 6–9 spokes biased along the incoming force, fine side branches, and a small impact ring. Glass, paper, stone, and digital targets receive separate stroke weights, colors, and glow. Direct hits and chain blasts use the same generator. Reduced Motion keeps static marks while removing their hit bloom. Damage, durability, scoring, and host-page DOM remain unchanged.
- **Prototype document:** `docs/KINETIC_DESTRUCTION_PROTOTYPE.md` records the hit geometry, per-material visual contract, performance caps, acceptance criteria, and follow-up slices for material-specific break animation and debris.
- **Checks:** 3 new deterministic/bounds/safe-input geometry tests and all 45 bridge/page-mode tests passed; Kinetic parity guard passed; Classic page bundle and full integrated build passed for both Classic and KS2. `git diff --check` passed before commit.
- **Browser:** the local build rendered the game-choice surface, but browser clicks did not open its game launch dialog, blocking a match-level visual check. The preview is deployment-protected. Visible crack growth at normal scale/mobile and the Reduced Motion render gate still need interactive browser verification.
- **Preview:** `https://lok-demo-j51ri210u-mistachatty-cmyks-projects.vercel.app` reached Ready for Demo Day commit `9f087c707927e101ccfb66a690254caecb7979e5`. Authenticated `/build.json` reports Kinetic source pin `c01a854232cfd7822cbd08a9a0e32436798bb221`; `/kinetic-official-page.js` returned HTTP 200 (149,436 bytes).
- **Next:** verify fracture marks visually on page targets for both versions; then implement one distinct break silhouette, starting with glass/media shards.

### Execution record — Kinetic held-key repeat regression (2026-10-19)

- **Production evidence:** `https://demo.gsix.online/build.json` reports Kinetic page adapter revision `9c68fcdb457131cba582307bf35fdf58a202d06b`. That revision returns early for `event.repeat`, so holding A or L only spawns once. The existing review branch had the intended held-key loop, but no direct regression test for its cadence.
- **Change:** extracted the hold lifecycle into a testable scheduler. The initial keydown spawns immediately; repeated browser keydown events do not reset its clock; A and L then repeat independently every 150 ms until keyup. Long frame stalls do not create catch-up bursts. Pointer holds use the same scheduler.
- **Source pin:** Kinetic source branch `codex/page-arena-destruction-physics`, commit `79bf2caaa713ee46a5b474003d49aeb69245730c`, pushed. Demo Day build pin updated; remaining source pins unchanged.
- **Checks:** regression tests cover initial/OS-repeat keydowns, 150 ms cadence, independent sides, and stopping on keyup. All 50 bridge/page-mode tests and the Kinetic parity guard passed; Classic typecheck, standalone build, and page adapter bundle build passed. Full integrated build and output verification passed, including Classic and KS2 standalone builds and the shared page adapter. Vercel preview verification is pending the updated root branch deployment.
- **Release note:** production remains on `9c68fc…` until the existing Demo Day review branch is merged and deployed. The review preview will carry this fix; no production promotion was performed.
- **Next:** inspect the preview build manifest and page-adapter response, then continue the roadmap's current Kinetic destruction and creator-tool phase.

- **Preview:** `https://lok-demo-kbcylzugp-mistachatty-cmyks-projects.vercel.app` reached READY for root commit `39e6690a9add8597d9a76aaee0953c9edaff6902`. Authenticated `/build.json` reports Kinetic source pin `79bf2caaa713ee46a5b474003d49aeb69245730c`; `/kinetic-official-page.js` returned HTTP 200 (151,824 bytes). The browser tool timed out attaching to local and preview tabs, so interactive hold behavior was verified through the regression tests, not a browser playthrough.

### Execution record — Kinetic paper/text split break (2026-10-19)

- **Source comparison:** page combat continues to render Classic and KS2 fighters, combat, and controls from the pinned source. Paper behavior is specific to the reversible webpage adapter: it must not snapshot text or replace either game's combat loop.
- **Change:** paper targets now gain a clipped, low-contrast crease with short forks during damage. When they break, a deterministic seam creates two complementary target-local strips that shear in opposing directions and fade quickly. The debris is paper-colored geometry only; original text remains in the untouched DOM, and the existing Restore/Rebuild flow reveals that content again. Reduced Motion still skips animated debris. Added deterministic geometry tests and wired them into the integrated test command.
- **Source pin:** Kinetic branch `codex/paper-text-page-break`, commit `ea0527bfa8f324668413e939ea3b2dde82623493`, pushed. Demo Day's pinned revision and parity docs now follow it; other pins are unchanged.
- **Checks:** 28 Kinetic page-mode tests passed, including new bounded/deterministic paper geometry checks; Classic page typecheck and adapter bundle passed; KS2 typecheck passed. All 52 integrated bridge/page tests and the Kinetic catalog parity guard passed. The full integrated build and output verification passed for Survivor, Kinetic, PongFall, both official Kinetic games, and the shared page adapter. `git diff --check` passed. First full-build attempt exposed the known Windows `sh` PATH issue; retry with Git for Windows `usr/bin` succeeded. Existing Survivor source-map and large-chunk warnings remain.
- **Browser:** the local production build opened Classic and KS2 page matches. In Classic, holding the left spawn control for 1.8 seconds increased P1 from 1 to 3, and the match advanced to 3 page breaks; Restore Page removed the overlay. In KS2, live Settings switched the same page match to alpha, held spawning increased P1 from 1 to 5, and combat advanced to 3 page breaks with a chain reaction. A paused screenshot showed the arena through broken page targets and paper damage-stage feedback. Restore Page again removed the overlay. The battle effects and short debris lifetime prevented isolating the two flying paper strips in a screenshot, so their visual acceptance remains open for both versions.
- **Preview:** `https://lok-demo-ppqel73zz-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `b8a2f84df6cb869f1393a71774f382cd180c88ac`. Authenticated `/build.json` reports Kinetic source `ea0527bfa8f324668413e939ea3b2dde82623493`; `/kinetic-official-page.js` returned HTTP 200 at 153,829 bytes. Deployment protection blocks a remote interactive playthrough; the matching local production build was checked through Classic page mode, held spawn, page breaks, and Restore Page.
- **Review handoff:** source and Demo Day commits are pushed on their review branches. GitHub PR creation was unavailable through the connector and `gh` is not installed; Vercel's Git integration generated the preview directly from the Demo Day branch. No merge or production promotion was performed.
- **Next:** finish glass/paper visual acceptance on the review preview, then add the bounded stone-chip/seam silhouette from `KINETIC_DESTRUCTION_PROTOTYPE.md`. Do not merge until the paper break and restore path are visibly confirmed in both Classic and KS2.

### Execution record — Kinetic stone seam and chips (2026-10-20)

- **Source comparison:** Classic and KS2 share the same reversible page adapter and existing material profiles. Glass already uses a deterministic full-panel fan; paper uses a seeded two-strip tear. Stone was still using the adapter's generic, random rectangular debris despite having a higher durability and thicker fracture marks. No standalone fighter, AI, or settings code needed to change.
- **Change:** stone damage now draws a short, target-clipped seam aligned to the last incoming impact, with a dark core and fine raised highlight. A broken stone target creates 3–5 deterministic irregular chips near the impact; they move more slowly and fade sooner than glass. Count and geometry respect existing debris limits, Low effects, and Reduced Motion. The original page node remains in place for Restore/Rebuild.
- **Source pin:** Kinetic source branch `codex/paper-text-page-break`, commit `2a335cd6c7dd3df491d1ac39adff117261cbb8d9`, pushed. Demo Day's submodule pointer and `scripts/pinned-revisions.json` now reference this revision; other pins are unchanged.
- **Checks:** focused chip geometry tests pass; all 54 integrated bridge/page tests pass; the visible-catalog Kinetic parity guard passes. Classic page typecheck and page adapter build pass. Full integrated build and static output verification pass for Survivor 616, Kinetic Souls, PongFall, both official Kinetic games, and the shared adapter. `git diff --check` passes. Existing Survivor sourcemap/large-bundle notices and the PongFall dependency-script notice remain.
- **Browser:** the local production build rendered with its full styling and showed Survivor, Kinetic, and PongFall selector cards. The three card preview canvases appeared empty in the screenshot. CUA could focus the Kinetic card and Wreck This Page control, but pointer and keyboard activation did not open their menus. Live stone damage, both-variant restoration, and chip visibility could not be confirmed in-browser in this run. Track selector preview rendering and an interactive browser input path as a separate release-gate fix.
- **Preview:** `https://lok-demo-9ho37mtzi-mistachatty-cmyks-projects.vercel.app` reached Ready for root commit `39fd0f7`. Authenticated `/build.json` reports Kinetic source `2a335cd6c7dd3df491d1ac39adff117261cbb8d9`; `/kinetic-official-page.js` returned HTTP 200 at 155,884 bytes. The preview's browser URL redirects to Vercel login; the connected Vercel fetch tool is unavailable, so interactive hosted play remains unverified.
- **Review handoff:** source commit `2a335cd` and root commit `39fd0f7` are pushed to their existing review branches. No merge or production promotion was performed.
- **Next:** verify the root preview pin/bundle and resolve the local browser input issue for a real Classic and KS2 stone break; capture the appearance and Restore/Rebuild path. Then proceed to the digital material silhouette (pixel blocks and local scanline tear).

### Execution record — Kinetic digital pixel tear (2026-10-20)

- **Source comparison:** both standalone games continue to supply the fighters, combat, and arena renderer. Digital material effects are page-adapter-only, since document elements and creator props are not part of either standalone game loop. The shared adapter already clips damage marks to each target rectangle and applies the selected material in Classic and KS2.
- **Change:** digital hits now leave a deterministic, compact cluster of mode-colored pixel bars near the impact. A restrained horizontal scanline offset appears briefly on new hits. Every mark stays clipped to the target; the host DOM is unchanged. Reduced Motion retains static marks and suppresses the offset, while Low effects reduces the number of bars.
- **Source pin:** Kinetic source branch `codex/paper-text-page-break`, commit `0d26c004f798e65983937932995e86d2d25c4951`, pushed. Demo Day pin and parity docs now follow it; other source pins are unchanged.
- **Checks:** focused digital geometry tests and all integrated bridge/page tests pass; the Kinetic visible-catalog parity guard passes. Classic page typecheck and page adapter bundle pass. The full integrated production build and output verification pass for this updated pin.
- **Browser:** the blank previews and inert menus recorded by the prior local check were caused by its temporary static server returning `application/octet-stream` for `.mjs` modules. With `.mjs` served as `text/javascript`, the chooser opened, the Classic version picker launched the live match, and fighter/NPC sprites rendered. Holding **A** for 1.5 seconds increased P1 from 1 to 2; a further 1.8-second hold increased it from 2 to 5 while the NPC count also advanced. Page-break and chain counters advanced during combat; a reload restored the page. The previews/cards stayed present as page content. Digital damage marks themselves were not isolated in this interaction, and hosted preview access still redirects to Vercel login.
- **Preview:** root commit `314938a` reached Ready at `https://lok-demo-26uho6otz-mistachatty-cmyks-projects.vercel.app`. Authenticated `/build.json` reports Kinetic source `0d26c004f798e65983937932995e86d2d25c4951`; `/kinetic-official-page.js` returned HTTP 200 with `Content-Length: 157107`. The hosted browser remains protected and redirected to Vercel login, so live hosted play was not performed.
- **Review handoff:** source commit `0d26c00` and root commit `314938a` are pushed to their existing review branches. No merge or production promotion was performed.
- **Next:** inspect the Vercel review preview’s source pin and adapter response. Then capture digital damage marks in both Classic and KS2 and compare the glass, paper, stone, and digital silhouettes at desktop and narrow widths. After that, consolidate debris cleanup and add the creator fracture preview.

### Execution record — segmented page prototype (2026-10-20)

- **Source:** Classic and KS2 still use their original fighter spawning, combat, Bestiary, and rendering. The new geometry is in their shared `page-mode/segment-field.mjs` and adapter. Source commits `6f6a656` and `2ed1764` are on `codex/paper-text-page-break`; Demo Day pins `2ed1764c447ea54c071acaa2ca0116ba41d7ba18`.
- **Implemented:** first impact allocates a sparse 16-pixel field near the hit; repeated stress opens local cells. Fighter and projectile collision use those cells, and the canvas reveals the selected arena through the same openings. Connected removed cells create bounded physical chunks with fighter knockback, at most 3 HP damage once per chunk/fighter, team KO credit, one secondary target contact, floor bounce, and subtle 2.5D faces. Four materials distribute stress differently. Settings offer Adaptive (default) or Deep everywhere for the next match; the result names the active mode. Links, controls, forms, marked game UI, and containers holding them are protected from scanning.
- **Verification:** 4 focused field tests and all 60 integrated bridge/page tests passed. Classic page typecheck, both official full-game builds, the page bundle, the full integrated build, output verification, and the visible-catalog parity guard passed. A local browser playthrough launched Classic and KS2, held A to spawn repeatedly, observed page breaks, switched versions from Settings, and restored the original page. A screenshot revealed navigation-link damage; the scanner fix was rebuilt and visually confirmed to leave the navigation intact during Classic combat.
- **Open gates:** an isolated screenshot of a new 16-pixel hole and moving chunk; nested parent/child reveal and frontmost collision; chunk-vs-target and KO scoring in an instrumented fixture; replay openings/chunks; uploaded-media texturing; measured burst frame time; narrow and Reduced Motion browser profiles; hosted Vercel interactive play. Survivor and PongFall have not adopted this contract. True voxels remain an opt-in authored-scene experiment. No production merge or domain change is part of this record.
- **Next bounded slice:** make nested layers and collision order agree, then snapshot openings and chunks into paused replay. Add a deterministic burst fixture and compare Full, Low, and Reduced Motion before expanding the contract to other game adapters.
- **Review preview:** [segmented prototype preview](https://lok-demo-2snj8th9d-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day commit `a494dce03d158e4b33db8965b1f20298c13633c8`. Authenticated `/build.json` reports source pin `2ed1764c447ea54c071acaa2ca0116ba41d7ba18`; `/kinetic-official-page.js` returned HTTP 200 (`application/javascript`, 164,478 bytes). The deployment is protected, so interactive hosted play remains open; the local integrated build was played in both variants.

### Execution record — nested page layers (2026-10-21)

- **Source:** `a615f31408972612a40dbdc815f79bdb7b895693` on the Kinetic review branch. Target contacts now process descendants before ancestors and stop after the first damaging fighter contact. A local child opening uses the nearest surviving ancestor's surface color; once that ancestor opens, the selected arena shows through. Links and control containers remain protected. The original DOM is not rewritten.
- **Focused checks:** two new nested-layer tests pass, along with the four segment-field tests and Classic page typecheck. A rebuilt local page bundle launched Classic and KS2, held A to spawn, advanced page breaks in both, switched variants from Settings, and restored the overlay. This checks the shared adapter path; a visual fixture with deliberately nested colored targets is still needed to isolate the parent-to-arena transition.
- **Limits:** parent imagery/text is represented by a procedural/computed background color, not a screenshot of the ancestor. Replay snapshots, physical surviving islands, mobile burst profiling, and other game adapters remain open. Next implement bounded destruction snapshots for paused replay, then a nested fixture and performance measurements before expanding the contract.
- **Checks and preview:** all 62 integrated tests, parity guard, Classic page typecheck, both standalone Kinetic builds, full Demo Day build, and output verification passed. [Layered review preview](https://lok-demo-868b4ouen-mistachatty-cmyks-projects.vercel.app) reached Ready for root commit `0fc90a4`; authenticated `/build.json` reports Kinetic source `a615f31408972612a40dbdc815f79bdb7b895693`. Hosted interactive play remains blocked by deployment protection; the matching local production build was played in both variants.

### Execution record — bounded destruction replay (2026-10-21)

- **Source:** Kinetic review branch commit `b719f3865d683d088dcdf2d7363dd3b1eb7b5c3a`. Once per second, the existing match timeline now copies up to 16 damaged fields, 192 removed keys per field, 256 whole-target areas, and 48 chunks. Scrubbing while paused renders the sampled openings and chunk positions. Source fighter IDs prevent later spawns appearing in earlier frames. The samples hold no DOM nodes or uploaded media bytes.
- **Checks:** focused tests verify early/late openings, copied chunk positions, and bounded history. Classic page typecheck and page bundle pass. In the local browser, scrubbing to 0 seconds removed the later arena openings, while the 11-second sample restored them; the creator panel remained responsive. Current source fighter objects removed by a KO cannot be fully reconstructed for old samples, so historical fighters may be absent. This is a known replay limitation, separate from destruction geometry.
- **Next:** add a deliberate nested-target fixture and measure a capped burst in desktop and narrow mobile profiles. Compare Full, Low, and Reduced Motion. Then add media fragment texture and connected surviving-island detachment before generalizing the contract to Survivor 616 and PongFall.
- **Integrated gate and preview:** all 64 bridge/page tests, Kinetic parity guard, both official full-game builds, page adapter bundle, full Demo Day build, and output verification passed. [Replay review preview](https://lok-demo-2jd5qjgof-mistachatty-cmyks-projects.vercel.app) reached Ready for root commit `c93cdd0`; authenticated `/build.json` reports Kinetic source `b719f3865d683d088dcdf2d7363dd3b1eb7b5c3a`. Hosted interactive play remains behind deployment protection; the matching local build was scrubbed in the browser.

### Execution record — enclosed islands and geometry burst (2026-10-21)

- **Source:** Kinetic review branch commit `b000403d12894765fb603f8bb4ea0752e478f978`. A bounded flood fill now identifies surviving solid cells isolated from every edge after an impact and detaches them through the existing chunk pool. A focused 3×3 enclosure test proves the last cut frees the center island; a tight cell budget leaves it solid rather than exceeding 192 active cells. Fields with more than 4,096 possible cells are rejected before flood-fill allocation.
- **Measured geometry fixture:** `node games/kinetic-official/page-mode/segment-burst.bench.mjs` ran 2,400 impacts over 600 samples and reported p50 0.041 ms, p95 1.146 ms, max 3.256 ms for geometry work on this development machine. Peaks stayed at 16 fields, 192 cells per target, and 48 chunks. These values exclude canvas rendering, scanning, and device GPU time; no desktop or mobile FPS claim follows from them.
- **Browser:** the locally rebuilt bundle launched Classic and KS2, held A spawned repeatedly, page-break counters advanced, and Restore removed the overlay. The exact enclosed-island silhouette was checked by the deterministic geometry test rather than isolated visually in random combat.
- **Next:** make an authored nested/island fixture for visual acceptance, profile Full/Low/Reduced Motion on desktop and narrow/mobile, and add user-owned media texture to fragments. Only then consider promoting the contract to Survivor and PongFall.
- **Integrated gate and preview:** all 65 bridge/page tests, parity guard, both official Kinetic builds, page adapter bundle, full Demo Day build, and output verification passed. [Island review preview](https://lok-demo-acn3yfofw-mistachatty-cmyks-projects.vercel.app) reached Ready for root commit `e14e83c`; authenticated `/build.json` reports source pin `b000403d12894765fb603f8bb4ea0752e478f978`. The local build was played in Classic and KS2; hosted interactive play remains behind deployment protection.

### Execution record — owned-media fragments (2026-10-21)

- **Source:** Kinetic review branch `codex/paper-text-page-break` commit `c0bf15b571654ef2fd847f2db531bd806046ed72`. Creator image/video targets now display the same cell openings used by combat collision. A temporary element's alpha mask removes those cells while the overlay draws its remaining media at document coordinates. Detached chunks sample the owned source frame using its `object-fit: contain` placement; video remains local and can continue playing on its pieces. Whole-target breaks hide the temporary element. Rebuild clears its mask, and Restore removes it and revokes its blob URL. Replay stores only the target ID and fragment offset, not media bytes.
- **Tests/build:** two new mask/placement tests plus a replay-source metadata assertion pass. All 67 integrated bridge/page tests, parity guard, both Kinetic standalone builds, page adapter typecheck/build, full Demo Day build, and output verification passed. No source game combat or save format changed.
- **Browser:** the local production build accepted a small local SVG in Classic and KS2. In each, dragging it into a fighter lane and briefly resuming produced a visible carved band and a nonempty alpha mask. Rebuild cleared the mask; Restore removed the overlay and temporary element. The browser reported no console errors. The Classic image can fully break during a sustained spawn hold. A controlled video upload/frame test and isolated textured-chunk screenshot remain open.
- **Preview:** [owned-media review preview](https://lok-demo-8gk4rke27-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day commit `9268bbcce95a3ae3eec9db108c8bc15364bf6218`. Authenticated `/build.json` reports the reviewed Kinetic source pin `c0bf15b571654ef2fd847f2db531bd806046ed72`; `/kinetic-official-page.js` returns HTTP 200 as JavaScript (170,387 bytes). Hosted interactive play remains behind deployment protection; the matching local production build was played in both versions.
- **Next:** create an authored nested/island visual fixture, measure Full/Low/Reduced Motion desktop and narrow frame times, and verify owned-video shards through pause/scrub/export. Keep Survivor/PongFall contract promotion and true voxels behind those gates.

### Execution record — owned-video match timeline (2026-10-21)

- **Source:** Kinetic review branch `codex/paper-text-page-break` commit `a619970a0883fd98b40a23bc7a2d6e8254d366df`. Local video playback now follows the match pause/resume state, including an upload made while paused. Each bounded replay sample stores at most 16 video target IDs and playback times, never file bytes or frame pixels. Scrubbing hides a video before its first sampled appearance and seeks its owned source to the sampled time afterward. Rebuild clears the replay selection and restores media visibility; opening a saved scene revokes replaced blob URLs. The creator's video timeline updates when its panel reopens.
- **Checks:** six video timeline tests pass. All 69 integrated tests, parity guard, Classic page typecheck, both standalone Kinetic builds, the page adapter bundle, full Demo Day build, and output verification passed. No standalone game save or combat rule changed.
- **Browser:** an eight-second, 320×240 local WebM was uploaded while Classic and KS2 were paused; both showed `paused: true` at time zero. Each resumed with the match and froze again on pause. Scrubbing to the pre-upload sample hid the video, and a later sample restored it paused at its recorded time (Classic about 3.05s, KS2 about 3.43s). Classic's **Export arena still** produced a PNG download. KS2 Rebuild restored the temporary object's visibility, and Restore removed both overlay and video. The browser console reported no errors.
- **Limits:** the replay seeks the present local video element and samples the decoded frame; it does not archive video frames, and old frames may need a decode delay. The still export captures the overlay canvas; intact DOM media and page text are not composited into that image. An isolated screenshot of a moving textured video chunk, saved-scene media reload, mobile/reduced-motion frame profiles, and hosted interactive play remain open.
- **Next:** create an authored nested/island fixture and run desktop/narrow Full, Low, and Reduced Motion render profiles. Verify a detached video chunk visibly advances and the local saved-scene reload before widening the target contract to Survivor 616 or PongFall.
- **Review preview:** [owned-video timeline preview](https://lok-demo-rmxocxc96-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day review commit `0884d81`. Authenticated `/build.json` reports the reviewed Kinetic source pin `a619970a0883fd98b40a23bc7a2d6e8254d366df`, and `/kinetic-official-page.js` returned HTTP 200 as JavaScript (172,273 bytes). Hosted interactive play remains behind deployment protection; the matching local production bundle was played in both variants. No production promotion occurred.

### Execution record — private creator scene reload (2026-10-21)

- **Source:** Kinetic review branch commit `9673ebd67bd98e438fa9c47a73739cadb137b391`. Local scene records now copy a version 1 field of at most 192 cell keys, stress values, and removed flags, plus the owned video's playback time. Reopening validates the saved field against the target's material and dimensions, rebuilds collision and its visible mask, seeks the local video after metadata loads, clears stale replay samples, and revokes replaced blob URLs. Older scene records remain openable without a field or saved video time. The media Blob remains in this browser's IndexedDB; it is not sent to an account or server.
- **Checks:** three focused scene-state tests cover copied damage, malformed/oversized rejection, and bounded video time. All 72 integrated bridge/page tests, parity guard, Classic page typecheck/build, both standalone Kinetic builds, full Demo Day build, and output verification passed. The source game loops and saves are unchanged.
- **Browser:** in the local production build, Classic saved an eight-second WebM paused at 5.985s, reopened it with a new blob URL at the same time, then reopened it again after a full page reload. KS2 opened that local scene at the same paused frame. Restore removed the overlay and temporary video; no browser console errors were reported. The deterministic test proved the saved cell map restores collision; this browser run did not produce an isolated carved-video screenshot.
- **Limit discovered:** a creator video placed in the fighter lane fell toward the bottom of a long page within seconds, making sustained media combat hard to stage. A placement/physics pass should bound or tune dynamic props in the visible arena while preserving document-space scrolling. Saved project selection still opens the latest scene, with no named scene picker or deletion.
- **Next:** create an authored nested/island and damaged-media fixture to visually verify reopened openings and advancing detached video texture. Profile Full/Low/Reduced Motion at desktop and narrow widths; then address creator-prop staging before sharing this destruction contract with Survivor 616 and PongFall.
- **Review preview:** [private scene reload preview](https://lok-demo-2ow3t93k3-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day review commit `4271a9c`. Authenticated `/build.json` reports Kinetic source `9673ebd67bd98e438fa9c47a73739cadb137b391`, and `/kinetic-official-page.js` returned HTTP 200 as JavaScript (173,790 bytes). Hosted interactive play remains behind deployment protection; the matching local production build completed the browser save/reload checks. No production promotion occurred.

### Execution record — staged creator-prop floors (2026-10-21)

- **Source:** Kinetic review branch commit `a9114b244b3fe82cf8f4913a15776eeecb5a2b93`. Each placed creator object now bounces against a fixed document-space floor near the viewport where it was added, instead of falling to the end of a long page. Drag release assigns a floor near the new placement. Rebuild returns the object to its original placement and floor; local save/open retains both the current and rebuild floors. Fighter motion, hits, and page-target geometry are unchanged.
- **Checks:** three focused stage tests cover a long page, a different scrolled section, and short-page bounds. All 75 integrated bridge/page tests, parity guard, Classic page typecheck/build, both standalone Kinetic builds, full Demo Day build, and output verification passed.
- **Browser:** in the local production build, a KS2 clip settled visibly at document Y 564 in the first 720-pixel viewport; after scrolling to Y 720, another clip settled at Y 1284 in that viewport. The document bottom was Y 3607. Scrolling left the first prop at its document coordinate. KS2 save/open kept its Y 564 placement. With the NPC disabled, a Classic clip placed while scrolled to Y 424 stayed visible at Y 988, inside the viewport ending at Y 1144. Restore in each variant removed the overlay and temporary media; no browser console errors were reported. An earlier Classic clip with the NPC active was destroyed before the long idle observation, as expected from combat.
- **Limits/next:** a dragged prop's new floor is covered by the bounded helper test, but a cross-section drag has not been exercised on a touch device. An authored nested/island and damaged-media fixture, advancing detached-video texture, and Full/Low/Reduced Motion desktop/narrow frame profiles remain the next destruction gates. The invisible local floor should be exposed as an optional creator placement guide if testing shows players cannot predict where props settle.
- **Review preview:** [staged creator-props preview](https://lok-demo-bpebodf0a-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day review commit `5c94c11`. Authenticated `/build.json` reports Kinetic source `a9114b244b3fe82cf8f4913a15776eeecb5a2b93`; `/kinetic-official-page.js` returned HTTP 200 as JavaScript (174,896 bytes). Hosted interactive play remains behind deployment protection; the matching local production bundle was played in both variants. No production promotion occurred.

### Execution record — nested layer visibility fixture (2026-10-23)

- **Source finding:** Classic and KS2 already resolve fighter/projectile contact from the frontmost nested target. The page renderer could draw a parent opening across an intact child because it sampled only the opening center and did not subtract surviving descendant geometry. A whole-parent break was especially visible: its large arena aperture could cover an unbroken inner panel.
- **Change:** Kinetic source revision `126832b3cbea49d0c1983386fdae2d265e0b2888` indexes nested targets once per damaged draw and subtracts each surviving child's solid rectangle or solid cell runs before painting the parent opening. This is overlay geometry only; host elements, combat, scoring, and standalone games are unchanged. A source-controlled page fixture at `/fixtures/kinetic-layers.html` provides three nested colored layers, a separate target, a newly inserted target via N, Classic/KS2 launch, and Restore.
- **Checks:** the focused layer test verifies that a 64×64 parent aperture excludes a 32×32 solid child, reveals one 16×16 child hole, and hides it again under a still-solid grandchild. All 76 integrated bridge/page tests and the visible-catalog parity guard passed. Classic page typecheck and page bundle passed. The full integrated build passed for Survivor, PongFall, both official Kinetic arenas, and the page adapter. Output verification passed and `build.json` reports the source revision above. Existing Survivor sourcemap/large-bundle notices, PongFall dependency-script notice, and Node shell deprecation notice remain.
- **Browser:** the local production page bundle launched Classic and KS2 on the fixture. Held A increased Classic's team from 1 to 9 and KS2's from 1 to 10; NPCs and page-break counters advanced. N inserted a new DOM page piece during KS2 play. Both variants restored the original nested colors and removed the overlay; no browser console errors were reported. Combat broke all three nested panels before a controlled parent-only screenshot could be captured, so partial-layer visual acceptance remains open. A click on the fixture's header during play hit the game's Settings overlay; the fixture now uses N for in-match insertion.
- **Next:** capture a controlled parent-only and child-hole frame, then measure Full/Low/Reduced Motion desktop and narrow frame times for this layered case. Check that long-page scrolling and newly inserted targets enter the scanner. After those gates, verify an advancing detached video texture before sharing the target contract with Survivor 616 and PongFall.
- **Review preview:** [layer visibility preview](https://lok-demo-py0oq183t-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day review commit `438446f`. Authenticated `/build.json` reports the reviewed Kinetic source pin `126832b3cbea49d0c1983386fdae2d265e0b2888`; the page adapter and fixture return HTTP 200 as JavaScript and HTML. Hosted interactive play remains behind deployment protection, so the matching local production bundle supplied the browser checks. No production promotion occurred.

### Execution record — exact nested aperture boundaries (2026-10-23)

- **Source finding:** child and parent fields each use target-local 16-pixel grids. When their document positions differ by a non-multiple of 16, the prior renderer classified a whole child opening by its center point. A single child aperture could cover both solid parent material and an open parent cell, so that shortcut showed the wrong surface across part of the aperture.
- **Change:** Kinetic source revision `ea5e78a59dc0c08dcbc8dc36842c51af51e59588` partitions each opening at surviving ancestor geometry and removed-cell boundaries, from the nearest parent outward. Small openings inspect only intersecting cells; larger openings reuse a per-draw cached field list. The host DOM, source fighters, combat outcomes, and standalone saves are unchanged. Demo Day pins this reviewed source revision.
- **Checks:** tests verify the exact 12×12 exposed area of a misaligned 16×16 child hole, the remaining parent area, a third ancestor, and the dense-field lookup. All 78 integrated bridge/page tests, parity guard, Classic page typecheck, and page bundle passed. `npm run bench:kinetic-layers` reproduces a Node-only 120-sample stress profile with 256 opening queries per sample and 192 removed parent cells; geometry p95 fell from 7.08 ms before the intersecting-cell lookup to 1.20 ms in the saved benchmark run. This is a synthetic geometry cost, not a browser FPS claim. The full integrated build and output verification passed for Survivor, PongFall, both Kinetic arenas, and the pinned page adapter; existing Survivor sourcemap/large-bundle and Node shell warnings remain.
- **Browser:** local Classic and KS2 page modes launched on the nested fixture, held A spawned fighters, and KS2 accepted N to insert page content during play. A KS2 frame showed holes in the red outer layer with the gold child still visible. Restore removed the overlays and retained the original nested panels in both variants; no console errors were reported. The browser did not isolate a single child hole exactly straddling a damaged parent cell; the deterministic geometry test covers that boundary.
- **Next:** capture coincident child/parent holes, then measure Full/Low/Reduced Motion desktop and narrow browser frame profiles with active target/chunk counts. Verify the newly inserted fixture piece after scrolling into view and an advancing owned-video fragment. Keep the Survivor/PongFall impact-contract rollout behind these gates.
- **Review preview:** [exact-layer preview](https://lok-demo-r8q5d3tot-mistachatty-cmyks-projects.vercel.app) reached Ready for Demo Day review commit `e5cecf1`. Authenticated `/build.json` reports Kinetic source `ea5e78a59dc0c08dcbc8dc36842c51af51e59588`; the official page adapter returned HTTP 200 as JavaScript (177,727 bytes) and the layered fixture returned HTTP 200. Hosted interactive play is still behind deployment protection, so the matching local production bundle supplied the browser playthrough. No production promotion occurred.

### Execution record — detached creator fragment staging (2026-10-23)

- **Finding and change:** creator props already had a local document-space floor, but their detached chunks still used the bottom of the whole page. Kinetic source revision `4857c45c87aaea35a04782182b69b3892fac4c80` records each dynamic target's stage floor on chunk creation and applies that floor during chunk physics. Static page debris retains the document floor. The source fighter and KO rules, DOM restoration, and standalone games are unchanged.
- **Checks:** four focused creator-stage tests pass, including fixed staging under document growth, page-debris fallback, invalid stage data, and a shrinking document. All 79 integrated bridge/page tests, the Kinetic visible-catalog parity guard, Classic page typecheck and page bundle, full Demo Day build, and output verification pass. Existing Survivor sourcemap/large-bundle and Node shell warnings remain.
- **Browser:** the matching local production bundle launched Classic and KS2 on the long layered fixture. Each mode placed a starter scene during combat, held A to spawn repeatedly, and restored the page afterward with no console errors. This did not isolate a fragment trajectory or an advancing video-textured fragment; the stage-floor geometry test is the direct check for this slice.
- **Next:** capture a controlled falling owned-video chunk in the visible stage and verify its texture advances. Then profile Full/Low/Reduced Motion at desktop and narrow widths with active counts, check scroll-added targets, and only then expand the impact contract to Survivor 616 and PongFall.
- **Review:** source commit `4857c45` and Demo Day commit `78f06cd` are pushed on their existing review branches. [Fragment-stage preview](https://lok-demo-bhx82gnc6-mistachatty-cmyks-projects.vercel.app) reached Ready; authenticated `/build.json` reports the exact source pin and the page adapter returned HTTP 200 as JavaScript (177,923 bytes). Hosted interactive play is protected, so the matching local production bundle supplied the Classic/KS2 browser checks. No production promotion occurred.
