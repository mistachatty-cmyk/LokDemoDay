import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateKineticPageRun } from '../site/page-run-protocol.mjs';

const base = {
  version: 1,
  gameKey: 'kinetic-souls',
  runId: '123e4567-e89b-42d3-a456-426614174000',
  variant: 'classic',
  durationMs: 119_500,
  matchDurationMs: 120_000,
  teamScores: { player1: 4, player2: 3 },
  result: 'Player 1 wins',
  score: 21,
  xp: 42,
  completedAt: '2026-10-19T13:00:00.000Z',
};

test('accepts configured match lengths and retains their run details', () => {
  for (const matchDurationMs of [60_000, 120_000, 180_000, 300_000]) {
    const run = validateKineticPageRun({ ...base, matchDurationMs, durationMs: matchDurationMs });
    assert.equal(run?.matchDurationMs, matchDurationMs);
    assert.equal(run?.durationMs, matchDurationMs);
  }
});

test('rejects unknown match lengths and durations outside the configured match', () => {
  assert.equal(validateKineticPageRun({ ...base, matchDurationMs: 90_000 }), null);
  assert.equal(validateKineticPageRun({ ...base, durationMs: 120_001 }), null);
  assert.equal(validateKineticPageRun({ ...base, durationMs: -1 }), null);
});

test('bounds the Kinetic run identity, result, scores, and timestamp', () => {
  assert.equal(validateKineticPageRun({ ...base, version: 2 }), null);
  assert.equal(validateKineticPageRun({ ...base, runId: 'invalid' }), null);
  assert.equal(validateKineticPageRun({ ...base, variant: 'experimental' }), null);
  assert.equal(validateKineticPageRun({ ...base, result: 'Reward unlocked' }), null);
  assert.equal(validateKineticPageRun({ ...base, teamScores: { player1: -1, player2: 0 } }), null);
  assert.equal(validateKineticPageRun({ ...base, completedAt: 'yesterday' }), null);
});
