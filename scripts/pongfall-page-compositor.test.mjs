import assert from 'node:assert/strict';
import { test } from 'node:test';
import { drawThroughPageApertures, getPageDamageApertures } from '../site/pongfall-page-compositor.mjs';

test('projects damaged document targets into the visible viewport', () => {
  const targets = [
    { x: 120, y: 240, width: 100, height: 60, reveal: 1 },
    { x: 250, y: 280, width: 100, height: 60, reveal: 0.25 },
    { x: 120, y: 240, width: 20, height: 20, reveal: 0 },
    { x: 20, y: 240, width: 20, height: 20, destroyed: false },
  ];
  assert.deepEqual(getPageDamageApertures(targets, { scrollX: 100, scrollY: 200, width: 300, height: 200 }), [
    { x: 20, y: 40, width: 100, height: 60 },
    { x: 175, y: 95, width: 50, height: 30 },
  ]);
});

test('clips aperture geometry to the viewport and bounds its count', () => {
  const targets = [
    { x: -10, y: 5, width: 25, height: 20, destroyed: true },
    { x: 15, y: 5, width: 20, height: 20, destroyed: true },
    { x: 500, y: 500, width: 10, height: 10, destroyed: true },
  ];
  assert.deepEqual(getPageDamageApertures(targets, { scrollX: 0, scrollY: 0, width: 30, height: 30 }, 1), [
    { x: 0, y: 5, width: 15, height: 20 },
  ]);
});

test('renders the source game inside one clipped union and restores canvas state', () => {
  const calls = [];
  const ctx = Object.fromEntries(['save', 'beginPath', 'rect', 'clip', 'restore'].map(name => [name, (...args) => calls.push([name, ...args])]));
  const drew = drawThroughPageApertures(ctx, [{ x: 2, y: 3, width: 4, height: 5 }, { x: 9, y: 8, width: 2, height: 1 }], () => calls.push(['paint']));
  assert.equal(drew, true);
  assert.deepEqual(calls.map(call => call[0]), ['save', 'beginPath', 'rect', 'rect', 'clip', 'paint', 'restore']);
});

test('skips empty aperture lists and restores state when rendering fails', () => {
  const calls = [];
  const ctx = Object.fromEntries(['save', 'beginPath', 'rect', 'clip', 'restore'].map(name => [name, (...args) => calls.push([name, ...args])]));
  assert.equal(drawThroughPageApertures(ctx, [], () => assert.fail('must not paint')), false);
  assert.throws(() => drawThroughPageApertures(ctx, [{ x: 0, y: 0, width: 1, height: 1 }], () => { throw new Error('render failed'); }), /render failed/);
  assert.deepEqual(calls.map(call => call[0]), ['save', 'beginPath', 'rect', 'clip', 'restore']);
});

test('skips malformed aperture geometry without invoking the renderer', () => {
  const ctx = { save() { assert.fail('invalid apertures should not change canvas state'); } };
  assert.equal(drawThroughPageApertures(ctx, [{ x: 0, y: 0, width: Number.NaN, height: 1 }], () => assert.fail('must not paint')), false);
});
