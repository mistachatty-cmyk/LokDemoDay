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

- **Game hub:** Survivor 616 and Kinetic Souls choices, game-specific routes, settings switcher, and live decorative previews.
- **Page combat:** reversible page overlay, two Kinetic versions, source fighters/Bestiary/themes, left/right team spawning, NPC opponent, match records, target destruction, and restore-page path.
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

1. Match setup: opponent mode, NPC enable/side, team control, match duration, score target, and rematch rules.
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
2. Add a game only after its core loop is mapped to page targets and a separate full-game route remains available.
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

## Model and dependency note

The current parity catalog, source mapping, documentation, and adapter changes are well-scoped engineering work and do not require a higher-tier model. If a future slice requires reconstructing unshared game behavior across multiple repositories, designing trusted account/reward security, or evaluating Twitch/ad policy at launch, first document the question, inspected source, alternatives, and acceptance tests here. Use a higher-tier review only for that bounded decision; keep all findings in this repository so work survives a model change.
