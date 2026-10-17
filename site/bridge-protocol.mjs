export const BRIDGE_VERSION = 1;
export const BRIDGE_TYPE = 'lok:demoday:event';
const RUN_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PICKUP_ID = /^[a-z0-9][a-z0-9._:-]{7,119}$/i;
const GAMES = new Set(['survivor-616', 'kinetic-souls']);

export function validBridgeEvent(data, expectedGame, expectedRun) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  if (!GAMES.has(expectedGame) || !RUN_ID.test(expectedRun || '')) return false;
  if (data.type !== BRIDGE_TYPE || data.version !== BRIDGE_VERSION ||
      data.gameId !== expectedGame || data.runId !== expectedRun) return false;
  if (data.event === 'start' || data.event === 'abort') return true;
  if (data.event === 'pickup') {
    return data.itemKey === 'rift-fragment' && typeof data.pickupId === 'string' && PICKUP_ID.test(data.pickupId);
  }
  if (data.event === 'complete') {
    return Number.isInteger(data.score) && data.score >= 0 && data.score <= 100000000 &&
      Number.isInteger(data.xp) && data.xp >= 0 && data.xp <= 100000 &&
      typeof data.completedAt === 'string' && /^\d{4}-\d\d-\d\dT/.test(data.completedAt) &&
      Number.isFinite(Date.parse(data.completedAt));
  }
  return false;
}
