import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeFrameIntervals } from './kinetic-frame-stats.mjs';

test('frame summary counts slow frames and stable percentiles', () => {
  const samples = Array.from({ length: 100 }, (_, index) => index < 95 ? 16.7 : 40);
  assert.deepEqual(summarizeFrameIntervals(samples), { frames: 100, p50Ms: 16.7, p95Ms: 16.7, maxMs: 40, over33Ms: 5 });
});

test('frame summary rejects insufficient or invalid samples', () => {
  assert.equal(summarizeFrameIntervals([0, NaN, Infinity, 16.7]), null);
});
