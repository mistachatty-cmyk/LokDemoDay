---
name: lok-ui
description: Design, build, or review interfaces for Lok ecosystem games and sites using the established interaction and accessibility guidance. Use for Lok UI work, not unrelated applications.
---

# Lok UI

Read the current project's UI and game behavior before changing it. Preserve the project's recognizable identity and player flow. For Demo Day, consult `docs/LOK_UI.md` and `docs/GAME_CHOICE.md` in LokDemoDay; treat their component API and motion rules as the starting reference, then adapt to the host app.

Build controls around a clear player action. Use native interactive elements with keyboard and touch behavior. Decorative previews must be silent, bounded, and hidden from assistive technology; stop their animation offscreen and honor reduced motion. Keep text legible over glass or gameplay imagery and provide a solid fallback when visual effects are unavailable.

Verify the real route or game action, narrow and embedded layouts, focus order, contrast, and reduced motion in a browser. Document reusable tokens and component lifecycles where future Lok projects can find them. Apply glass styling only when it suits the specific interface.
