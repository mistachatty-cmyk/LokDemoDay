/** Silent, real-source game previews for Lok choice buttons. */
const FRAME_MS = 1000 / 30;
const sources = {
  survivor: () => import('/survivor-preview.js?v=gameplay-2'),
  classic: () => import('/kinetic-preview.js?v=gameplay-2'),
  ks2: () => import('/kinetic-preview.js?v=gameplay-2'),
};
const pending = new Map();

function sourceFor(type) {
  const key = type === 'survivor' ? 'survivor' : 'kinetic';
  if (!pending.has(key)) pending.set(key, sources[type]());
  return pending.get(key);
}

/** Mount decorative canvases; the parent button still owns focus and selection. */
export function mountGameChoices(root = document) {
  const previews = [...root.querySelectorAll('canvas[data-lok-preview]')].map(canvas => ({
    canvas, type: canvas.dataset.lokPreview, ctx: canvas.getContext('2d'), width: 0, height: 0,
    visible: false, scene: null, loading: false, last: 0,
  })).filter(item => item.ctx && sources[item.type]);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canDraw = item => {
    const dialog = document.querySelector('dialog[open]');
    return item.visible && (!dialog || dialog.contains(item.canvas));
  };
  const motionEnabled = () => {
    try {
      const setting = localStorage.getItem('lok:demoday:live-previews');
      return setting === 'on' || (setting !== 'off' && !reduced.matches);
    } catch { return !reduced.matches; }
  };
  let frame = 0, stopped = false;

  function paint(item, elapsed = FRAME_MS, frozen = false) {
    const { ctx, width, height } = item;
    if (!width || !height) return;
    if (!item.scene) {
      ctx.fillStyle = item.type === 'survivor' ? '#131722' : '#171421';
      ctx.fillRect(0, 0, item.canvas.width, item.canvas.height);
      return;
    }
    item.scene.paint(ctx, width, height, elapsed, frozen);
  }
  function load(item) {
    if (item.loading || item.scene || stopped) return;
    item.loading = true;
    sourceFor(item.type).then(module => {
      if (stopped) return;
      item.scene = module.createPreview(item.type === 'survivor' ? undefined : item.type);
      paint(item, FRAME_MS, !motionEnabled());
      schedule();
    }).catch(error => {
      console.error(`Unable to load ${item.type} gameplay preview`, error);
      item.canvas.parentElement?.classList.add('preview-unavailable');
    });
  }
  function resize(item) {
    const rect = item.canvas.getBoundingClientRect();
    const width = Math.round(rect.width), height = Math.round(rect.height);
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const scale = Math.min(dpr, Math.sqrt(360000 / (width * height)));
    const backingW = Math.max(1, Math.round(width * scale));
    const backingH = Math.max(1, Math.round(height * scale));
    if (item.canvas.width !== backingW || item.canvas.height !== backingH) {
      item.canvas.width = backingW;
      item.canvas.height = backingH;
    }
    item.width = width; item.height = height;
    paint(item, FRAME_MS, true);
  }
  function shouldRun() {
    return !stopped && motionEnabled() && !document.hidden && previews.some(item => canDraw(item) && item.scene && item.width && item.height);
  }
  function tick(now) {
    frame = 0;
    if (!shouldRun()) return;
    for (const item of previews) {
      if (!canDraw(item) || !item.scene) continue;
      if (now - item.last < FRAME_MS) continue;
      const elapsed = item.last ? Math.min(now - item.last, 75) : FRAME_MS;
      item.last = now;
      paint(item, elapsed);
    }
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (shouldRun() && !frame) frame = requestAnimationFrame(tick);
    else if (!shouldRun() && frame) { cancelAnimationFrame(frame); frame = 0; }
  }
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = previews.find(preview => preview.canvas === entry.target);
      if (!item) continue;
      item.visible = entry.isIntersecting;
      item.last = 0;
      if (item.visible) { resize(item); load(item); }
    }
    schedule();
  }, { threshold: 0.01 });
  const size = new ResizeObserver(entries => {
    for (const entry of entries) {
      const item = previews.find(preview => preview.canvas === entry.target);
      if (item) resize(item);
    }
  });
  const dialogs = new MutationObserver(schedule);
  for (const dialog of document.querySelectorAll('dialog')) dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  for (const item of previews) { visibility.observe(item.canvas); size.observe(item.canvas); resize(item); }
  const onMotion = () => { for (const item of previews) if (item.visible) paint(item, FRAME_MS, true); schedule(); };
  reduced.addEventListener('change', onMotion);
  window.addEventListener('lok:preview-motion-change', onMotion);
  document.addEventListener('visibilitychange', schedule);
  return { destroy() {
    stopped = true;
    if (frame) cancelAnimationFrame(frame);
    visibility.disconnect(); size.disconnect();
    dialogs.disconnect();
    reduced.removeEventListener('change', onMotion);
    window.removeEventListener('lok:preview-motion-change', onMotion);
    document.removeEventListener('visibilitychange', schedule);
  } };
}
