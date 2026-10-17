import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BRIDGE_TYPE, BRIDGE_VERSION, validBridgeEvent } from '../site/bridge-protocol.mjs';

const runId = '123e4567-e89b-42d3-a456-426614174000';
const base = { type: BRIDGE_TYPE, version: BRIDGE_VERSION, gameId: 'kinetic-souls', runId };

test('accepts only the active game and run', () => {
  assert.equal(validBridgeEvent({ ...base, event: 'start' }, 'kinetic-souls', runId), true);
  assert.equal(validBridgeEvent({ ...base, event: 'abort' }, 'kinetic-souls', runId), true);
  assert.equal(validBridgeEvent({ ...base, event: 'start' }, 'survivor-616', runId), false);
  assert.equal(validBridgeEvent({ ...base, event: 'start' }, 'kinetic-souls', crypto.randomUUID()), false);
  assert.equal(validBridgeEvent({ ...base, version: 2, event: 'start' }, 'kinetic-souls', runId), false);
});

test('accepts bounded run results and cosmetic pickups', () => {
  const complete = { ...base, event: 'complete', score: 126, xp: 12, completedAt: '2026-10-17T14:00:00.000Z' };
  assert.equal(validBridgeEvent(complete, 'kinetic-souls', runId), true);
  assert.equal(validBridgeEvent({ ...complete, score: Infinity }, 'kinetic-souls', runId), false);
  assert.equal(validBridgeEvent({ ...complete, xp: -1 }, 'kinetic-souls', runId), false);
  assert.equal(validBridgeEvent({ ...base, event: 'pickup', itemKey: 'rift-fragment', pickupId: 'arena:rift-01' }, 'kinetic-souls', runId), true);
  assert.equal(validBridgeEvent({ ...base, event: 'pickup', itemKey: 'lok-coins', pickupId: 'arena:rift-01' }, 'kinetic-souls', runId), false);
});
