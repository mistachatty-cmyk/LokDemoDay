# Lok GameChoice

`site/game-choice.js` and `site/game-choice.css` provide a framework-neutral, silent game selector. Demo Day uses it on its home cards, page combat picker, Settings game switcher, and Kinetic version picker. Selecting a button follows the host application's existing route.

## Markup and API

```html
<button class="lok-choice choice-kinetic" type="button" data-game="kinetic-souls">
  <canvas data-lok-preview="classic" aria-hidden="true"></canvas>
  <span>Kinetic Souls</span>
</button>
<script type="module">
  import { mountGameChoices } from './game-choice.js';
  const choices = mountGameChoices();
  // When a client-side view is permanently removed: choices.destroy();
</script>
```

`mountGameChoices(root = document)` mounts canvases inside the root and returns `{ destroy() }`. Supported preview values are `survivor`, `classic`, and `ks2`. The caller owns button labels, focus order, click behavior, and navigation. The canvas must have `aria-hidden="true"`; never make it a second interactive target.

The component creates local, disposable preview game state; it never touches account saves, audio, or rewards. When a canvas becomes visible, it loads `survivor-preview.js` or `kinetic-preview.js`, both compiled from the pinned game source in `previews/`. Survivor runs its real `createWorld` / `stepWorld` / `renderWorld` combat simulation. Kinetic uses Classic or KS2's own fighter spawner and character renderer in a small team-battle loop. It draws only while visible and the tab is foregrounded, caps rendering at 30 FPS and backing resolution at 360,000 pixels, and renders a still frame when reduced motion is requested. The page mode and Settings menus offer an explicit **Play live previews** opt-in that can override device reduced motion for this site. The choice is saved locally. `ResizeObserver` keeps the preview sharp as a card expands. Call `destroy()` when removing a mounted view.

## Visual contract

Use `.lok-choice` for the glass surface, `.choice-survivor` or `.choice-kinetic` for an accent, and keep text above the preview with an opaque gradient. The accent and glow are CSS variables `--choice-accent` and `--choice-glow`; another game can set these without copying the component stylesheet. Hover and keyboard focus share the expansion and edge highlight. Touch uses the pressed state and does not rely on hover. The solid-color fallback must stay readable where `backdrop-filter` is unsupported.

Keep previews recognizable: Survivor 616 shows its real player, enemies, attacks, and map; Kinetic Classic and KS2 show their own spawned fighters trading hits. The selector's battle is a short automatic sample, while full controls and complete gameplay remain behind the selection button. Review a game's current art and loop before adding a renderer.

## Adding another Lok game

Add a new `data-lok-preview` value, a preview adapter compiled from that game's pinned source, and accent tokens in the host stylesheet. Connect the button through the host's ordinary game selection path. Keep the preview silent and bounded; do not load a full game iframe inside a selector. Verify a still frame, mobile layout, keyboard selection, and the real launch route before publishing.
