# Demo Day MVP tracker

This is the release checklist for `demo.gsix.online` and `gsix.online/games/demoday`. Keep gameplay changes in the two game repositories and pin their reviewed commits here. A preview must build and receive a browser playthrough before each production pin changes.

## Gate 1 — playable hub

- [x] Both games are visible in the GSix and Demo Day selectors.
- [x] Switch games from Settings; unloading an iframe stops its loop and audio.
- [x] Play either game inside GSix or on the standalone Demo Day site.
- [x] Vercel builds the pinned submodules and records their revisions in `/build.json`.
- [ ] Replace the selector's CSS simulations with small captured gameplay clips only after the added media cost is approved. Muted live preview remains optional.

## Gate 2 — destruction studio and game modes

- [x] Starter maps, local image upload, local MP4/WebM upload, pause, timeline scrubbing, movable broken pieces, rebuild, PNG export, and short WebM recording.
- [x] Website field opens a page for Survivor's reversible overlay and explains CSP/browser restrictions.
- [x] YouTube URL uses the official player, separate from the destructible uploaded-video canvas.
- [x] Both games can fight over the full live webpage. Survivor uses its established overlay; Kinetic page mode runs the selected Classic/KS2 team match over DOM targets. Its in-match sandbox targets share the Kinetic physics and destruction path.
- [x] Kinetic Classic and KS2 page modes use a two-minute match with Player 1 versus a toggleable right-side NPC, timed Player 2 takeover, KO scoring, result screen, and rematch. Creator props/media use the same Kinetic target collision and damage path. Preview cards are excluded from both games' page scanners.
- [x] The Kinetic in-match Creative Sandbox has starter prop scenes, local image/video targets, object movement and physics, pause, video and match replay scrubbing, rebuild, local save/open, still export, and supported-browser WebM capture. The panel minimizes while combat continues.
- [x] Place an image or supported video on the live webpage as a movable session target before choosing either game. The file stays in this browser and can be removed. Kinetic's page arena has been browser-tested against an uploaded image.
- [ ] Connect the page arenas and studio media through a shared target adapter so images, video, and site elements can use the same combat modes.
- [x] Save, reopen, and delete local studio scenes in browser storage, including private uploaded media and piece positions.

## Gate 3 — account progress

- [x] Versioned same-origin game iframe bridge validates parent/child windows, game IDs, run IDs, and bounded event data.
- [x] GSix stores guest run summaries locally and signed-in summaries in private Supabase rows with row-level rules.
- [x] Guest run and Rift Fragment claims merge into the account on sign-in; the account claim appears in the GSix hub and embedded game inventory indicator.
- [x] A boss defeat in either Demo Day game earns the cosmetic Rift Fragment once per run. Kinetic is pinned in production; Survivor is pending [PR #297](https://github.com/mistachatty-cmyk/Loksurvivor/pull/297).
- [x] Sync private project titles, source types, and timestamps through the signed-in GSix hub; deleting a local scene removes its account metadata. Uploaded media remains on its original device.
- [ ] Provide account progress on a standalone full-screen Demo Day visit. At present cross-device sync requires play inside signed-in GSix.
- [ ] Add a trusted receipt before using any game event for competitive ranking or spendable rewards. Browser reports are personal records only.

## Gate 4 — creator and monetization pilots

- [x] Labeled house promotion bounces untouchably during display, then becomes a separate destructible scene. The local 50 XP bonus is capped at three clears per UTC day. No ad network is connected.
- [ ] Streamer scene, Twitch OAuth, EventSub subscriptions, bounded chat enemies, moderation filters, and a kill switch.
- [ ] Licensed sponsor creative approval and reporting. Network rewarded ads remain off until an approved account and compliant format are configured.
- [ ] Use the ecosystem Lok Music player in the standalone studio; GSix already offers Lok Music around the embedded player.
- [ ] Localize standalone Demo Day and studio controls. The GSix hub uses the ecosystem translator.

## Release checks

1. Confirm `/build.json` names the intended reviewed revisions and Vercel reports Ready.
2. In a browser, start Survivor, switch to Kinetic from Settings, start a Kinetic match, then open and clear a starter studio map.
3. Sign in on GSix, complete a run and collect a Rift Fragment, reload and check the private record and game inventory indicator. Repeat on another device before calling account sync complete.
4. Test upload, pause/scrub, rebuild and exports using user-owned test media; test a blocked external page and a YouTube URL without altering its player.
5. Confirm the house promotion cannot be clicked during its display, transforms into a different destroyable object, and awards no more than three daily bonuses.

The first release is not complete until every acceptance path in the plan has been exercised, including creator and streamer paths. Ship unfinished gates behind explicit labels instead of presenting them as finished.
