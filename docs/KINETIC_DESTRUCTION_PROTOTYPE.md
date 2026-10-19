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

## Destruction pass detail checklist

### Glass and media

- Starburst origin at the projectile/fighter contact point.
- Long directional lead crack and fine branching lines.
- Bright inner edge plus colored refracted glint, strongest on the newest fracture.
- Repeated impacts add to the fracture map instead of replacing previous visible hits.
- Break: outward shard burst, short ring, then reveal the arena through the damaged opening.

### Paper and text

- Crease line precedes a split; small forks end in tapered, low contrast strokes.
- Upper and lower halves should shear in opposite directions on break.
- Keep copy legible at low damage and respect page restoration.

### Stone and structural panels

- Short, heavy chips around the contact point; cracks travel less distance than glass.
- Damage grows with visible chips and deeper seams before the panel collapses.
- High durability stays legible without relying on repeated screen shake.

### Digital surfaces

- Brief pixel offset at impact, thin scanline tear, then persistent fragmented contour.
- Keep glitch displacement inside the target's clipped bounds.
- Avoid flashing large regions; honor Reduced Motion and Low effects.

## Next prototype slices

1. Compare screenshots from real page targets and tune the material silhouettes at 100% and mobile scale.
2. Add distinct break animations per material: glass shards, paper strips, stone chips, and short-lived digital blocks.
3. Add force-to-debris transfer and wall/floor collisions while keeping the current particle/shard caps.
4. Add a readable fracture preview to the creator panel, then validate rebuild and exact page restoration after each material break.

## Acceptance

- A repeated hit leaves a growing, directionally coherent mark rather than swapping to one new crack.
- At least four visible material classes look different at the same damage percentage.
- Every generated point stays inside the affected target, and replaying a seed produces the same pattern.
- Low effects reduces decorative bloom and debris without reducing cracks or changing combat values.
- Reduced Motion shows static damage states with no hit bloom or camera shake.
- Restore removes the overlay and returns the host page to its original rendered state.
