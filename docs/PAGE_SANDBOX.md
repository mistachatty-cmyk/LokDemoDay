# The webpage is the arena

Demo Day's primary play path starts on the actual webpage. `Wreck this page` offers Survivor 616 or Kinetic Souls. The standalone full games and the smaller media editor are secondary entry points.

## Layer contract

1. The live website stays underneath. Games may read layout rectangles and computed styles to locate targets, but must not remove, rewrite, or submit page content.
2. A viewport-sized full-resolution layer paints reversible damage over page elements. A separate low-resolution canvas is scaled with nearest-neighbor rendering for actors and pixel effects. This is the layered rendering technique described by [Sprite Fusion](https://www.spritefusion.com/blog/pixel-art-rendering-trick-for-a-90s-look).
3. A temporary input layer prevents gameplay clicks from activating links or buttons. Restore removes all game layers and listeners and returns the original scroll position.
4. Each game's page adapter belongs in its game repository. Survivor's adapter uses its world engine, character roster, waves, and DOM scanner. Kinetic's adapter owns momentum movement, jumping, dashing, aimed projectiles, enemy collision, and page-target scoring. Demo Day pins reviewed builds of both.

## Expansion points

- A shared target contract should expose bounding boxes, material/type, hit points, damage state, and rewards. It can project starter maps, user media, and permitted live pages into either game without changing the games' core loops.
- The page selector now places a private image or MP4/WebM/Ogg video as a movable live DOM target in the arena. The file uses a session-only object URL and can be removed from the page. Kinetic's scanner treats it as a page target; the full shared target contract and persistent media scenes are still planned.
- Kinetic Classic and KS2 use the same page adapter, with their original character, weapon, physics-damage, and arena-background renderers selected by version. The default page arena uses the original Synthwave background and bouncy movement. When fighters or shots hit a page target, cracks open to that animated arena, impact flashes and recoil show where force landed, and a break throws color-matched fragments that spin, fall, and bounce. These effects stay on the reversible overlay; the site's DOM remains intact.
- The left and right team spawn buttons fire immediately and repeat every 250 ms while held; keyboard A and L remain one-shot spawns. Pointer release, cancellation, or page restoration stops the spray timers.
- Kinetic page targets now progress through cracked, breaking, and unstable damage stages. The largest eligible piece becomes a one-run Rift Warden with triple target health, a visible health readout, and a nine-second pulse that damages nearby page pieces. Breaking a piece triggers a bounded chain blast against up to four nearby targets; defeating the Warden expands that blast to eight targets and a wider radius. Chain blasts do not recursively trigger more blasts, keeping frame cost and cascade size bounded. No page text or controls are changed.
- Survivor 616 already routes its native world impacts through the page adapter: breaking a block flashes and dissolves it, throws pixel debris, can open a crater into its map scenery, and applies the game's hit-stop and combo feedback. It keeps its own fixed-step world physics.
- The creator panel can float above the arena for pause, scrubbing, element placement, rebuild, and export. User-owned video can supply moving textures. YouTube stays in its official player with controls visible.
- Streams, sponsor objects, and approved rewarded placements can add bounded targets through the same contract. They must not make ordinary display ads clickable combat targets.
- Completion events carry versioned game ID, run ID, score, and cosmetic XP to the account bridge. Competitive or spendable rewards need a trusted receipt.

The original [`Destroy Any Website`](https://destroy.spritefusion.com/) inspired the website-sized play field. Demo Day's live-page overlay is its own implementation and uses no Sprite Fusion code or art.
