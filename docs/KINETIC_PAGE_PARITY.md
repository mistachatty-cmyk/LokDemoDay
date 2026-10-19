# Kinetic Souls page-mode parity

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
- Current pinned source for page-mode setup and material behavior: `2daf1db87665a450b4998ceea0ed7e00d60e9cbc`.
- The HUD now uses Kinetic's compact monospace visual language, separate Classic and KS2 accents, legible team scores, match time, and page-break chain feedback.
- Page targets use an explicit, shared material profile in Classic and KS2: media is fragile glass, text is paper, semantic panels are sturdy stone, and other page/creator objects are digital. Each profile changes effective impact damage, durability, and its three readable damage-stage labels; boss health still scales on top of the material rule.

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
- Add impact direction to target cracks/knockback and fighter recoil; existing target hit stages and break feedback remain in place.
- Give fighters and weapons meaningful page-target interactions, including boss telegraphs, target knockback, chain reactions, and short hit-stop that respects reduced motion.
- Keep all edits in the overlay or its scene objects. Never mutate the host page's DOM to simulate damage.
- Add a low-effects mode for slow devices and let users tune shake, particles, and flashes.

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
