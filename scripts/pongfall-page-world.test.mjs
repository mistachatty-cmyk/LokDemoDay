import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPageWorldTransform } from '../site/pongfall-page-world.mjs';

test('maps PongFall world coordinates into a document-sized page world', () => {
  const transform = createPageWorldTransform({ originX: 640, originY: 900, scale: 0.5 });
  assert.deepEqual(transform.toDocument({ x: 120, y: -40 }, 600), { x: 700, y: 1480 });
});

test('converts page pointers back to source simulation coordinates as the world falls', () => {
  const transform = createPageWorldTransform({ originX: 640, originY: 900, scale: 0.5 });
  assert.deepEqual(transform.toWorld({ x: 700, y: 1680 }, 800), { x: 120, y: -40 });
});

test('projects a fixed page target into the moving PongFall world', () => {
  const transform = createPageWorldTransform({ originX: 400, originY: 500, scale: 0.5 });
  const target = { x: 350, y: 1000, width: 100, height: 80 };
  assert.deepEqual(transform.targetToWorld(target, 300), { x: -100, y: 400, width: 200, height: 160 });
  assert.deepEqual(transform.targetToWorld(target, 500), { x: -100, y: 0, width: 200, height: 160 });
});

test('rejects invalid transforms and non-finite geometry', () => {
  assert.throws(() => createPageWorldTransform({ originX: 0, originY: 0, scale: 0 }));
  const transform = createPageWorldTransform({ originX: 0, originY: 0, scale: 1 });
  assert.equal(transform.toDocument({ x: Number.NaN, y: 0 }, 0), null);
  assert.equal(transform.targetToWorld({ x: 0, y: 0, width: -1, height: 10 }, 0), null);
});
