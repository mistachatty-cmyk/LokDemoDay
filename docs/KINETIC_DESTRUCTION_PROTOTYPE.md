# Kinetic page destruction prototype

## Goal

Make every hit read as a physical event on the page: players should see where it landed, how force traveled through the surface, how close that object is to breaking, and why two materials react differently. The host document itself remains untouched; the Kinetic overlay owns every crack, chip, shard, and damaged-state reveal.

## Prototype 0.1 — impact fracture map

Implemented in the shared Classic/KS2 page adapter:

1. **Contact point:** normalize the attack vector, convert the impact to target-local coordinates, and clamp generated vertices to the target bounds.
2. **Primary cracks:** create 6–9 radial spokes around the impact. The incoming direction biases one spoke longer, so cracks visibly carry force into the surface.
3. **Branching:** each spoke gets two short side fractures at staggered points. Their angle and length vary from a seeded generator, giving natural variation without changing when the same impact is replayed.
4. **Micro detail:** draw a small stress ring at the latest hit and a fine second highlight along glass fractures. New hits bloom briefly, then settle into persistent damage.
5. **Cumulative damage:** retain the latest six impact maps per target. As damage advances through the existing three material stages, fractures become more visible and line weight changes.
6. **Material response:** glass uses a cool white core with a team-colored glint; paper uses warm, thin lines; stone gets thicker, muted fractures; digital surfaces use the game's Classic or KS2 accent and a restrained glow.
7. **Chain impacts:** chain blasts use the same fracture path, so secondary damage leaves a mark at the actual chain impact location.
8. **Safety and performance:** each map is capped at 30 segments, each target retains at most six maps, and drawing is clipped to the target. The geometry is deterministic and bounded. Static damage remains visible under Reduced Motion; the short line bloom and contact-ring pulse disappear.

The first implementation adds impact geometry, not a new health rule. Material damage, target durability, fighter recoil, score, and restoration behavior are unchanged.

## Prototype 0.2 — glass and media fracture shards

Glass and media now break into a deterministic triangle fan instead of the generic rectangular debris used by the other materials. The fan keeps the impact near its center, includes the target's full perimeter and all four corners, and tiles the media rectangle without gaps before pieces move. Each polygon launches radially from the impact, gets a fine white edge and a mode-colored refracted edge, then falls, bounces once its motion settles, and fades under the existing debris lifetime and global cap. Implemented in Kinetic source commit `6b4cac76788e64928d3d69027ec5bc5d87632f4c`.

- The geometry generator accepts a target-local impact and seed, clamps output to 6–24 polygons, and returns no geometry for invalid sizes or impacts.
- The adapter caps glass pieces using the current effects setting, routes direct and chain breaks through the same material branch, and clears debris when Rebuild is pressed.
- Reduced Motion skips shard spawning and movement; the target still reaches the normal broken state and reveals the arena.
- The host element and its layout are unchanged. Restore/Rebuild clears the overlay's broken-area mask so the original page content appears again.
- Three focused tests verify deterministic geometry, in-bounds vertices, perimeter coverage, non-degenerate triangles, and invalid-input handling.

Geometry tests and integrated builds pass, but the shard appearance has not yet been confirmed in an interactive browser. The local integrated build served through the current shell returned `net::ERR_EMPTY_RESPONSE` in the in-app browser, and the Vercel preview remains deployment protected. Validate the shape at desktop and phone scale as soon as an interactive authenticated browser path is available.

## Destruction pass detail checklist

### Glass and media

- Starburst origin at the projectile/fighter contact point.
- Long directional lead crack and fine branching lines.
- Bright inner edge plus colored refracted glint, strongest on the newest fracture.
- Repeated impacts add to the fracture map instead of replacing previous visible hits.
- Break: outward shard burst, short ring, then reveal the arena through the damaged opening.

### Paper and text

- **Prototype 0.3 implemented:** a clipped, low-contrast crease with two small forks appears on paper targets before break. At break, a seeded seam splits the target into two complementary strips that shear in opposite directions and fade quickly.
- The strips contain only a paper-colored surface; they do not capture or duplicate the text. The original page node remains intact underneath the reversible damage overlay.
- Tests verify deterministic seam geometry, shared edges, complete area coverage, bounds, and invalid-input handling. The interactive appearance and exact restore path still need the browser gate below.
- Implemented in Kinetic source commit `ea0527bfa8f324668413e939ea3b2dde82623493`.

### Stone and structural panels

- **Prototype 0.4 implemented:** the damage stages add a short, dark seam aligned to the incoming impact, with a fine raised edge. A break produces 3–5 compact, deterministic polygons clustered near the impact. They travel more slowly and fade sooner than glass.
- Chip polygons clamp to the target rectangle and use the existing 180-piece debris cap. Low effects reduces the burst; Reduced Motion retains the static seam and skips moving debris.
- Geometry tests cover repeatability, count limits, compact reach, bounds, non-degenerate area, and invalid inputs. Interactive appearance and exact restoration remain part of the browser gate.
- Implemented in Kinetic source commit `2a335cd6c7dd3df491d1ac39adff117261cbb8d9`.

### Digital surfaces

- Brief pixel offset at impact, thin scanline tear, then persistent fragmented contour.
- Keep glitch displacement inside the target's clipped bounds.
- Avoid flashing large regions; honor Reduced Motion and Low effects.

## Next prototype slices

1. Compare glass, paper, and stone silhouettes against real page content at desktop and mobile scale; tune visibility, lifetimes, and impact placement. Visual acceptance remains open.
2. Add clipped pixel blocks and a local scanline tear for digital surfaces.
3. After all four silhouettes read clearly, unify their collision bounds and cleanup through one bounded debris pool.
4. Add a readable fracture preview to the creator panel, then validate replay, rebuild, and exact page restoration after each material break.

## Acceptance

- A repeated hit leaves a growing, directionally coherent mark rather than swapping to one new crack.
- At least four visible material classes look different at the same damage percentage.
- Every generated point stays inside the affected target, and replaying a seed produces the same pattern.
- Low effects reduces decorative bloom and debris without reducing cracks or changing combat values.
- Reduced Motion shows static damage states with no hit bloom or camera shake.
- Restore removes the overlay and returns the host page to its original rendered state.
