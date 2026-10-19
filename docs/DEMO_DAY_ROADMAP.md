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
3. Improve force transfer: impact direction, target recoil, fighter recoil, shatter clusters, debris lifetime, chain reactions, boss telegraphs, and recovery.
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
- **Preview:** pending deployment inspection.
