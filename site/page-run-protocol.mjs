const RUN_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MATCH_DURATIONS = new Set([60_000, 120_000, 180_000, 300_000]);
const RESULTS = new Set(['Player 1 wins', 'Player 2 / NPC wins', 'Draw']);

export function validateKineticPageRun(run) {
  if (!run || typeof run !== 'object' || Array.isArray(run) || run.version !== 1 || run.gameKey !== 'kinetic-souls') return null;
  if (typeof run.runId !== 'string' || !RUN_ID.test(run.runId) || !['classic', 'ks2'].includes(run.variant) || ![1, 2].includes(run.npcSide)) return null;
  if (!MATCH_DURATIONS.has(run.matchDurationMs) || !Number.isFinite(run.durationMs) || run.durationMs < 0 || run.durationMs > run.matchDurationMs) return null;
  if (!Number.isInteger(run.score) || run.score < 0 || run.score > 100_000_000 ||
      !Number.isInteger(run.xp) || run.xp < 0 || run.xp > 100_000) return null;
  if (!run.teamScores || !Number.isInteger(run.teamScores.player1) || run.teamScores.player1 < 0 ||
      !Number.isInteger(run.teamScores.player2) || run.teamScores.player2 < 0 || !RESULTS.has(run.result)) return null;
  if (typeof run.completedAt !== 'string' || !/^\d{4}-\d\d-\d\dT/.test(run.completedAt) || !Number.isFinite(Date.parse(run.completedAt))) return null;

  return {
    runId: run.runId,
    variant: run.variant,
    npcSide: run.npcSide,
    durationMs: run.durationMs,
    matchDurationMs: run.matchDurationMs,
    score: run.score,
    xp: run.xp,
    teamScores: { player1: run.teamScores.player1, player2: run.teamScores.player2 },
    result: run.result,
    completedAt: run.completedAt,
  };
}
