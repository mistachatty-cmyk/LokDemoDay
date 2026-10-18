# Lok interface guidance

Demo Day is the first place to try reusable Lok UI patterns. Carry successful patterns to other Lok sites and apps after testing them in their own context; preserve each game's recognizable art, controls, and tone.

- Start from the player's next action. A preview card should explain what happens when selected and should take the player there in one clear step.
- Use game-colored accents over a shared neutral frame. The glass edge is a surface treatment, not a reason to make controls or body text transparent.
- Motion should explain state or make play feel alive. Keep it silent by default, pause it offscreen, and provide a still frame for reduced motion.
- Give pointer, touch, and keyboard users the same choices. Use native buttons and dialogs, visible focus, readable contrast, and separate decorative canvas content from accessible labels.
- Test at narrow widths and inside GSix's embedded view. A selector must work without blur support, animation, or a powerful graphics device.
- Document a reusable component's minimal API, tokens, lifecycle, and launch behavior next to the component. Avoid copying a visual pattern across repos until its interaction has been verified.

See [GameChoice](GAME_CHOICE.md) for the first component and its extension contract.
