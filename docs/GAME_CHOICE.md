# Lok GameChoice

`site/game-choice.js` and `site/game-choice.css` provide a framework-neutral, silent game selector. Demo Day uses it on its home cards, page combat picker, Settings game switcher, and Kinetic version picker. It is a visual preview, not a game instance: selecting a button follows the host application's existing route.

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

The component creates no game state, save data, audio, or network requests. It draws only while a canvas is visible and the tab is foregrounded, caps rendering at 30 FPS and backing resolution at 650,000 pixels, and renders a still frame when reduced motion is requested. `ResizeObserver` keeps the preview sharp as a card expands. Call `destroy()` when removing a mounted view.

## Visual contract

Use `.lok-choice` for the glass surface, `.choice-survivor` or `.choice-kinetic` for an accent, and keep text above the preview with an opaque gradient. The accent and glow are CSS variables `--choice-accent` and `--choice-glow`; another game can set these without copying the component stylesheet. Hover and keyboard focus share the expansion and edge highlight. Touch uses the pressed state and does not rely on hover. The solid-color fallback must stay readable where `backdrop-filter` is unsupported.

Keep previews recognizable: Survivor 616 shows a player, an approaching swarm, and shots; Kinetic Classic shows left and right fighters colliding around a page fragment; KS2 adds distinct fighter effects. These are attract loops inspired by reviewed game behavior, not embedded copies of the complete engines. Review a game's current art and loop before adding a new renderer.

## Adding another Lok game

Add a new `data-lok-preview` value and drawing function in `game-choice.js`, give it accent tokens in the host stylesheet, and connect its button through the host's ordinary game selection path. Keep the preview silent and bounded; do not load a full game iframe inside a selector. Verify a still frame, mobile layout, keyboard selection, and the real launch route before publishing.
