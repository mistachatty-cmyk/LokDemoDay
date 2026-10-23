import { performance } from 'node:perf_hooks';
import { createSegmentField } from '../games/kinetic-official/page-mode/segment-field.mjs';
import { openingLayerRects } from '../games/kinetic-official/page-mode/layers.mjs';

const outerNode = { parentElement: null }, innerNode = { parentElement: outerNode };
const field = createSegmentField(640, 384, 'digital');
for (let index = 0; index < 192; index++) field.cells.set(index * 3, { stress: 2, removed: true });
field.removedCount = 192;
const outer = { element: outerNode, x: 0, y: 0, width: 640, height: 384, field, destroyed: false };
const inner = { element: innerNode, x: 7, y: 5, width: 608, height: 352, destroyed: false };
const targets = new Map([[outerNode, outer], [innerNode, inner]]);
const samples = [];
for (let frame = 0; frame < 120; frame++) {
  const start = performance.now(), cache = new Map();
  for (let index = 0; index < 256; index++) {
    const x = 7 + ((index * 37 + frame * 3) % 592);
    const y = 5 + ((index * 29 + frame * 2) % 336);
    openingLayerRects(inner, targets, { x, y, width: 16, height: 16 }, cache);
  }
  samples.push(performance.now() - start);
}
samples.sort((a, b) => a - b);
const at = percentile => Number(samples[Math.floor((samples.length - 1) * percentile)].toFixed(3));
console.log(JSON.stringify({ profile: 'nested layer geometry only', frames: 120, queriesPerFrame: 256,
  removedParentCells: 192, geometryFrameMs: { p50: at(0.5), p95: at(0.95), max: at(1) } }, null, 2));
