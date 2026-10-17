# Demo Day game bridge v1

The shell embeds reviewed builds of Survivor 616 and Kinetic Souls under its own origin. Gameplay and detailed saves remain in their source repositories. The bridge carries only run summaries and the cosmetic Rift Fragment pickup to the shell.

## Handshake

When a game iframe loads or restarts, the shell generates a fresh UUID and sends this message to that iframe with `location.origin` as the target origin:

```json
{"type":"lok:demoday:init","version":1,"gameId":"survivor-616","runId":"<uuid>","items":["rift-fragment"]}
```

The game accepts it only when `event.source === window.parent`, `event.origin === location.origin`, the version is `1`, and the game ID matches its own. It holds the run ID in memory and emits the following messages to its parent at `location.origin`:

```json
{"type":"lok:demoday:event","version":1,"gameId":"survivor-616","runId":"<uuid>","event":"start"}
{"type":"lok:demoday:event","version":1,"gameId":"survivor-616","runId":"<uuid>","event":"pickup","itemKey":"rift-fragment","pickupId":"<stable pickup id>"}
{"type":"lok:demoday:event","version":1,"gameId":"survivor-616","runId":"<uuid>","event":"abort"}
{"type":"lok:demoday:event","version":1,"gameId":"survivor-616","runId":"<uuid>","event":"complete","score":42,"xp":10,"completedAt":"2026-10-17T14:00:00.000Z"}
```

The shell validates the source window, origin, version, game ID, run ID, event shape, and numeric bounds. It accepts one start, deduplicates pickups by ID, and accepts one completion per run. Completion, abort, switching games, or restarting rotates the run ID and sends a new init event. A pickup can only identify `rift-fragment`; currency or gameplay items are outside this bridge.

GSix sends the signed-in or guest cosmetic inventory to the shell from the embedding frame. The shell accepts only that parent window on an allowed GSix origin and forwards a bounded `items` list to the active game. Inventory changes use `lok:demoday:inventory` without resetting the active run. A full-screen visit to the standalone Demo Day domain does not inherit the GSix session.

When GSix embeds the shell, it receives sanitized completion and pickup messages from the shell and verifies the shell iframe window and Demo Day origin before touching local or account progress. Browser-reported scores are private personal records, never authoritative competitive or economic rewards.
