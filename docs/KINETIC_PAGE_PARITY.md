# Kinetic Souls page-mode parity plan

## Product rule

The Classic and KS2 repositories remain the source of truth for character rendering, fighter spawning, weapons, combat, modifiers, themes, and Bestiary data. Demo Day should adapt those systems to its document-sized, reversible arena; it should not present a separate shooter with Kinetic branding. Page-only rules must be labeled as page adaptations, and unsupported full-arena settings must link to the standalone game instead of pretending to work.

## Current slice

- Match the real Kinetic UI language: pixel-friendly monospace labels, dark grid-compatible panels, crisp borders, orange/purple Classic accents, and the compact time/teams/KOs HUD. KS2 uses its violet/cyan identity and native fighter renderer.
- Populate modifier controls from the actual Classic and KS2 theme catalogs. Keep full-game names legible instead of exposing enum slugs.
- Bring the original arena hazards that map cleanly to a document world into page mode: ice, black hole, lava floor, storm drift, bouncy, wrap, and blackout inside damaged-page reveals.
- Implement the source game's Shrinking Arena and LoK Bounty rules as bounded page-world behaviors. Bounty targets are neutral, limited by the existing fighter cap, and award no currency.
- Keep the page's text and controls untouched. Canvas-only effects reveal the game underneath damage; `Restore page` removes the overlay and restores scrolling.

## Next slices

1. **Parity manifest and provenance.** Maintain version-specific, typed lists of modifiers, themes, environments, fighter IDs, and weapons from each source. For every entry, record whether it is native, adapted for page mode, or standalone-only. Build fails if an option is exposed without an implementation or an explanatory fallback.
2. **Controls and match setup.** Make player-vs-NPC, player-vs-player, NPC side, spawn cadence, and keyboard/touch controls read like the original game's settings. Keep the current two-minute page match as the default, then add score-based matches only after their win condition and completion event are defined.
3. **Combat feel.** Reuse the original fighter, weapon, hit, and Bestiary systems first. Improve target impact, material-specific break stages, hit-stop, chain reactions, and boss attacks without changing the original page DOM. Provide a quick setting to tune effect intensity for low-power devices and reduced motion.
4. **Creator inside play.** Make saved scene pieces show clear health/material feedback in the same match, add a fighter-safe placement preview, and let the creator pause or minimize without hiding the primary spawn controls. Keep replay data bounded and local unless the player explicitly saves a shareable project.
5. **UX verification.** Compare Classic and KS2 side by side with their standalone menus, HUD, settings, and Bestiary. Test desktop, touch, embedded GSix, keyboard focus, reduced motion, minimum browser performance, page restoration, and a complete match before promoting any release.

## Release gates

- Add an option only when its behavior is implemented and version-checked. Give experimental page adaptations a clear `PAGE MODE` label.
- Keep Demo Day and game repositories on review branches. Each source change updates the pinned revision, passes both game's builds plus bridge tests, and receives a Vercel preview playthrough.
- Use previews for review. Production merges, promotions, and account/database writes remain separate release actions.
