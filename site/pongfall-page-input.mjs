const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Adapts PongFall's double-tap thrust and two-finger pinball gestures to a page host. */
export function createPageTouchActions({ onThrust, onPower, now = () => performance.now(), doubleTapMs = 300, doubleTapDistance = 90, tapMs = 250, tapSlop = 14 }) {
  if (typeof onThrust !== 'function' || typeof onPower !== 'function' || typeof now !== 'function'
    || ![doubleTapMs, doubleTapDistance, tapMs, tapSlop].every(Number.isFinite)
    || doubleTapMs <= 0 || doubleTapDistance <= 0 || tapMs <= 0 || tapSlop <= 0) {
    throw new TypeError('PongFall touch actions require callbacks and positive gesture limits.');
  }

  const active = new Map();
  let lastTap = null;

  function pointerDown(event) {
    if (!event || event.pointerType !== 'touch' || !Number.isFinite(event.pointerId)
      || !Number.isFinite(event.x) || !Number.isFinite(event.y) || active.has(event.pointerId)) return;
    if (event.ignored) {
      for (const pointer of active.values()) pointer.chord = true;
      lastTap = null;
      return;
    }
    const at = now();
    const chord = active.size > 0;
    if (chord) {
      for (const pointer of active.values()) pointer.chord = true;
      if (active.size === 1) onPower();
      lastTap = null;
    } else if (lastTap && at - lastTap.at >= 0 && at - lastTap.at <= doubleTapMs
      && distance(lastTap, event) <= doubleTapDistance) {
      onThrust();
      lastTap = null;
    } else {
      lastTap = null;
    }
    active.set(event.pointerId, { x: event.x, y: event.y, at, moved: false, chord });
  }

  function pointerMove(event) {
    const pointer = active.get(event?.pointerId);
    if (!pointer || !Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
    if (distance(pointer, event) > tapSlop) pointer.moved = true;
  }

  function pointerUp(event) {
    if (!event || event.pointerType !== 'touch') return;
    const pointer = active.get(event.pointerId);
    if (!pointer) return;
    active.delete(event.pointerId);
    if (!pointer.chord && !pointer.moved && now() - pointer.at <= tapMs) {
      lastTap = { x: pointer.x, y: pointer.y, at: pointer.at };
    }
  }

  function pointerCancel(pointerId) {
    if (!active.has(pointerId)) return;
    active.delete(pointerId);
    for (const pointer of active.values()) pointer.chord = true;
    lastTap = null;
  }

  function reset() {
    active.clear();
    lastTap = null;
  }

  return { pointerDown, pointerMove, pointerUp, pointerCancel, reset };
}
