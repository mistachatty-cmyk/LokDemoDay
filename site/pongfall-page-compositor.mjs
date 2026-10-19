const finite = (...values) => values.every(Number.isFinite);

/** Project document-space damage into the visible canvas, with a bounded reveal. */
export function getPageDamageApertures(targets, viewport, maxApertures = 180, maxCandidates = 900) {
  if (!Array.isArray(targets) || !viewport || !finite(viewport.scrollX, viewport.scrollY, viewport.width, viewport.height)
    || viewport.width <= 0 || viewport.height <= 0 || !Number.isInteger(maxApertures) || maxApertures < 0
    || !Number.isInteger(maxCandidates) || maxCandidates < 0) return [];

  const apertures = [];
  for (const target of targets.slice(0, maxCandidates)) {
    if (apertures.length >= maxApertures) break;
    if (!target || !finite(target.x, target.y, target.width, target.height) || target.width <= 0 || target.height <= 0) continue;
    const reveal = target.destroyed === true ? 1 : (Number.isFinite(target.reveal) ? Math.min(1, Math.max(0, target.reveal)) : 0);
    if (reveal <= 0) continue;

    const fraction = Math.sqrt(reveal);
    const full = {
      x: target.x - viewport.scrollX,
      y: target.y - viewport.scrollY,
      width: target.width,
      height: target.height,
    };
    const expanded = {
      x: full.x + (full.width * (1 - fraction)) / 2,
      y: full.y + (full.height * (1 - fraction)) / 2,
      width: full.width * fraction,
      height: full.height * fraction,
    };
    const left = Math.max(0, expanded.x), top = Math.max(0, expanded.y);
    const right = Math.min(viewport.width, expanded.x + expanded.width);
    const bottom = Math.min(viewport.height, expanded.y + expanded.height);
    if (right > left && bottom > top) apertures.push({ x: left, y: top, width: right - left, height: bottom - top });
  }
  return apertures;
}

/** Draw the original game renderer only through damaged page regions. */
export function drawThroughPageApertures(ctx, apertures, drawSourceWorld) {
  if (!Array.isArray(apertures) || apertures.length === 0) return false;
  const valid = apertures.filter(rect => rect && finite(rect.x, rect.y, rect.width, rect.height) && rect.width > 0 && rect.height > 0);
  if (valid.length === 0) return false;
  ctx.save();
  try {
    ctx.beginPath();
    for (const rect of valid) ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();
    drawSourceWorld(ctx);
  } finally {
    ctx.restore();
  }
  return true;
}
