import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPageTouchActions } from '../site/pongfall-page-input.mjs';

function setup() {
  const calls = { thrust: 0, power: 0 };
  let now = 0;
  const actions = createPageTouchActions({
    onThrust: () => calls.thrust++,
    onPower: () => calls.power++,
    now: () => now,
  });
  return { actions, calls, setNow: value => { now = value; } };
}

const touch = (pointerId, x, y, ignored = false) => ({ pointerId, pointerType: 'touch', x, y, ignored });

test('double tap thrusts once while ordinary single taps stay neutral', () => {
  const { actions, calls, setNow } = setup();
  actions.pointerDown(touch(1, 80, 120)); actions.pointerUp(touch(1, 80, 120));
  assert.deepEqual(calls, { thrust: 0, power: 0 });
  setNow(210);
  actions.pointerDown(touch(2, 92, 128));
  assert.deepEqual(calls, { thrust: 1, power: 0 });
  actions.pointerUp(touch(2, 92, 128));
});

test('separate or slow taps do not thrust', () => {
  const { actions, calls, setNow } = setup();
  actions.pointerDown(touch(1, 0, 0)); actions.pointerUp(touch(1, 0, 0));
  setNow(301); actions.pointerDown(touch(2, 0, 0)); actions.pointerUp(touch(2, 0, 0));
  setNow(400); actions.pointerDown(touch(3, 200, 0)); actions.pointerUp(touch(3, 200, 0));
  assert.equal(calls.thrust, 0);
});

test('a two-finger chord activates pinball once and never double-tap thrust', () => {
  const { actions, calls, setNow } = setup();
  actions.pointerDown(touch(1, 20, 30));
  setNow(20); actions.pointerDown(touch(2, 80, 90));
  actions.pointerUp(touch(2, 80, 90));
  actions.pointerUp(touch(1, 20, 30));
  assert.deepEqual(calls, { thrust: 0, power: 1 });
});

test('movement, cancellation, ignored controls, and mouse input cannot become taps', () => {
  const { actions, calls, setNow } = setup();
  actions.pointerDown(touch(1, 0, 0)); actions.pointerMove({ pointerId: 1, x: 20, y: 0 }); actions.pointerUp(touch(1, 20, 0));
  setNow(100); actions.pointerDown(touch(2, 0, 0)); actions.pointerCancel(2);
  setNow(150); actions.pointerDown(touch(3, 0, 0, true)); actions.pointerUp(touch(3, 0, 0, true));
  actions.pointerDown({ pointerId: 4, pointerType: 'mouse', x: 0, y: 0 });
  assert.deepEqual(calls, { thrust: 0, power: 0 });
});

test('touching a page control breaks the double-tap chain and cannot complete a chord', () => {
  const { actions, calls, setNow } = setup();
  actions.pointerDown(touch(1, 10, 10)); actions.pointerUp(touch(1, 10, 10));
  setNow(100); actions.pointerDown(touch(2, 10, 10, true)); actions.pointerUp(touch(2, 10, 10, true));
  setNow(120); actions.pointerDown(touch(3, 10, 10)); actions.pointerUp(touch(3, 10, 10));
  actions.reset(); setNow(200); actions.pointerDown(touch(4, 10, 10));
  actions.pointerDown(touch(5, 15, 15, true)); actions.pointerUp(touch(5, 15, 15, true));
  actions.pointerUp(touch(4, 10, 10));
  assert.deepEqual(calls, { thrust: 0, power: 0 });
});

test('resetting page visibility state clears an incomplete touch sequence', () => {
  const { actions, calls, setNow } = setup();
  actions.pointerDown(touch(1, 20, 20)); actions.pointerUp(touch(1, 20, 20));
  actions.reset(); setNow(100);
  actions.pointerDown(touch(2, 20, 20));
  assert.deepEqual(calls, { thrust: 0, power: 0 });
});
