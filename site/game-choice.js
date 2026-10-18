/** Lightweight, silent attract loops for Lok game-choice buttons. */
const FRAME_MS = 1000 / 30;
const TWO_PI = Math.PI * 2;

function drawSurvivor(ctx, w, h, time) {
  const t = time * 0.001;
  const cx = w * (0.5 + Math.sin(t * 0.72) * 0.105);
  const cy = h * (0.52 + Math.cos(t * 0.57) * 0.09);
  ctx.fillStyle = '#111725'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#ffffff12'; ctx.lineWidth = 1;
  const grid = Math.max(27, w / 11);
  for (let x = (t * 7) % grid; x < w; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = (t * 5) % grid; y < h; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  for (let i = 0; i < 17; i++) {
    const angle = i * 2.399 + t * (i % 2 ? -0.13 : 0.15);
    const radius = 0.33 + (i % 4) * 0.095;
    const x = cx + Math.cos(angle) * w * radius;
    const y = cy + Math.sin(angle) * h * radius;
    ctx.fillStyle = i % 5 === 0 ? '#f4a26f' : '#ba594f';
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.fillStyle = '#ffcf9b'; ctx.fillRect(x - 1, y - 1, 2, 2);
  }
  for (let i = 0; i < 5; i++) {
    const angle = t * 2.9 + i * TWO_PI / 5;
    const distance = (t * 62 + i * 44) % (Math.max(w, h) * 0.48);
    ctx.strokeStyle = '#ffd484aa'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance);
    ctx.lineTo(cx + Math.cos(angle) * (distance + 13), cy + Math.sin(angle) * (distance + 13)); ctx.stroke();
  }
  const glow = ctx.createRadialGradient(cx, cy, 3, cx, cy, 46);
  glow.addColorStop(0, '#f4775880'); glow.addColorStop(1, '#f4775800');
  ctx.fillStyle = glow; ctx.fillRect(cx - 46, cy - 46, 92, 92);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(t * 1.4) * 0.18);
  ctx.fillStyle = '#ffe0a7'; ctx.fillRect(-5, -13, 10, 26); ctx.fillRect(-13, -5, 26, 10);
  ctx.fillStyle = '#fff8df'; ctx.fillRect(-4, -4, 8, 8); ctx.restore();
}

function drawKinetic(ctx, w, h, time, ks2) {
  const t = time * 0.001;
  ctx.fillStyle = ks2 ? '#101527' : '#171421'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = ks2 ? '#66d8e31b' : '#c7a3f51c'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + w * 0.23, h); ctx.stroke(); }
  const fragmentX = w * 0.5 + Math.sin(t * 0.6) * w * 0.04;
  const fragmentY = h * 0.48;
  ctx.strokeStyle = '#e8e1ee55'; ctx.lineWidth = 2;
  ctx.strokeRect(fragmentX - 25, fragmentY - 18, 50, 36);
  if (Math.sin(t * 2.8) > 0.3) {
    ctx.fillStyle = ks2 ? '#9eefff88' : '#dfb6ff88';
    for (let i = 0; i < 6; i++) ctx.fillRect(fragmentX + Math.cos(i * 2.4 + t) * (12 + i * 5), fragmentY + Math.sin(i * 2.4 + t) * (10 + i * 4), 5, 5);
  }
  const count = ks2 ? 5 : 4;
  for (let team = 0; team < 2; team++) {
    const color = team ? '#8de5f4' : '#f58b9b';
    const weapon = team ? '#d9faff' : '#ffe1a4';
    for (let i = 0; i < count; i++) {
      const phase = i * 1.71 + team * 2.2;
      const approach = Math.sin(t * 1.35 + phase) * w * 0.115;
      const x = w * (team ? 0.72 : 0.28) + (team ? -1 : 1) * approach + Math.sin(t * 0.8 + phase) * 9;
      const y = h * (0.25 + i * 0.14) + Math.cos(t * 1.8 + phase) * 14;
      const angle = t * (team ? -2.1 : 2.2) + phase;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.shadowBlur = 13; ctx.shadowColor = color;
      ctx.fillStyle = color; ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = '#fff8ed'; ctx.fillRect(-2, -2, 4, 4);
      ctx.shadowBlur = 0; ctx.strokeStyle = weapon; ctx.lineWidth = ks2 ? 3 : 2;
      ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(ks2 && i % 2 ? 22 : 17, 0); ctx.stroke();
      if (ks2 && i % 2) { ctx.strokeStyle = '#d5baffaa'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = team ? '#8de5f4' : '#f58b9b'; ctx.fillRect(x - 8, y - 15, 16, 2);
    }
  }
  ctx.fillStyle = ks2 ? '#c8b3ff' : '#ffe0a3';
  const impact = (Math.sin(t * 4.2) + 1) / 2;
  ctx.globalAlpha = impact * 0.8;
  for (let i = 0; i < 8; i++) {
    const a = i * TWO_PI / 8 + t;
    ctx.fillRect(fragmentX + Math.cos(a) * (8 + impact * 25), fragmentY + Math.sin(a) * (8 + impact * 25), 3, 3);
  }
  ctx.globalAlpha = 1;
}

/**
 * Mount all canvases marked data-lok-preview in a root. The canvas is decorative;
 * its parent button owns focus, accessible name, and navigation.
 * @returns {{destroy(): void}}
 */
export function mountGameChoices(root = document) {
  const previews = [...root.querySelectorAll('canvas[data-lok-preview]')].map(canvas => ({
    canvas, type: canvas.dataset.lokPreview, ctx: canvas.getContext('2d'), width: 0, height: 0, visible: false,
  })).filter(item => item.ctx);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, last = 0, stopped = false;

  function resize(item) {
    const rect = item.canvas.getBoundingClientRect();
    const width = Math.round(rect.width), height = Math.round(rect.height);
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const scale = Math.min(dpr, Math.sqrt(650000 / (width * height)));
    item.canvas.width = Math.max(1, Math.round(width * scale));
    item.canvas.height = Math.max(1, Math.round(height * scale));
    item.width = width; item.height = height;
    item.ctx.setTransform(item.canvas.width / width, 0, 0, item.canvas.height / height, 0, 0);
    paint(item, 0);
  }
  function paint(item, time) {
    const { ctx, width, height, type } = item;
    if (!width || !height) return;
    if (type === 'survivor') drawSurvivor(ctx, width, height, time);
    else drawKinetic(ctx, width, height, time, type === 'ks2');
  }
  function shouldRun() { return !stopped && !reduced.matches && !document.hidden && previews.some(item => item.visible && item.width && item.height); }
  function tick(now) {
    frame = 0;
    if (!shouldRun()) return;
    if (now - last >= FRAME_MS) {
      last = now;
      for (const item of previews) if (item.visible) paint(item, now);
    }
    frame = requestAnimationFrame(tick);
  }
  function schedule() { if (shouldRun() && !frame) frame = requestAnimationFrame(tick); else if (!shouldRun() && frame) { cancelAnimationFrame(frame); frame = 0; } }
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = previews.find(preview => preview.canvas === entry.target);
      if (item) { item.visible = entry.isIntersecting; if (entry.isIntersecting) resize(item); }
    }
    schedule();
  }, { threshold: 0.01 });
  const size = new ResizeObserver(entries => { for (const entry of entries) { const item = previews.find(preview => preview.canvas === entry.target); if (item) resize(item); } schedule(); });
  for (const item of previews) { visibility.observe(item.canvas); size.observe(item.canvas); resize(item); }
  const onMotion = () => { if (reduced.matches) for (const item of previews) paint(item, 0); schedule(); };
  reduced.addEventListener('change', onMotion);
  document.addEventListener('visibilitychange', schedule);
  return { destroy() { stopped = true; if (frame) cancelAnimationFrame(frame); visibility.disconnect(); size.disconnect(); reduced.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', schedule); } };
}
