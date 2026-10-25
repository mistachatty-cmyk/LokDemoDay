import { summarizeFrameIntervals } from './kinetic-frame-stats.mjs';

const status = document.querySelector('header strong');
document.querySelectorAll('[data-variant]').forEach(button => button.addEventListener('click', () => {
  const result = window.KineticSoulsOfficialPage?.start({ variant: button.dataset.variant });
  if (!result?.ok) status.textContent = result?.reason || 'Kinetic page adapter did not load.';
}));
const sampleButton = document.querySelector('#sample-frames');
const frameResult = document.querySelector('#frame-result');
sampleButton.addEventListener('click', async () => {
  const host = document.querySelector('#lok-kinetic-official-page');
  if (!host || document.visibilityState !== 'visible') {
    frameResult.textContent = 'Start a visible match before sampling.';
    return;
  }
  sampleButton.disabled = true;
  frameResult.textContent = 'Sampling 120 visible frames…';
  const startChunks = Number(host.dataset.activeChunks || 0);
  const intervals = [];
  let previous;
  let interrupted = false;
  await new Promise(resolve => {
    let done = false;
    const finish = failed => {
      if (done) return;
      done = true;
      interrupted = failed;
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', onVisibility);
      resolve();
    };
    const onVisibility = () => { if (document.visibilityState !== 'visible') finish(true); };
    const timeout = setTimeout(() => finish(true), 10000);
    document.addEventListener('visibilitychange', onVisibility);
    const next = time => {
      if (done) return;
      if (document.visibilityState !== 'visible' || !host.isConnected) { finish(true); return; }
      if (previous !== undefined) intervals.push(time - previous);
      previous = time;
      if (intervals.length === 120) finish(false); else requestAnimationFrame(next);
    };
    requestAnimationFrame(next);
  });
  const summary = interrupted ? null : summarizeFrameIntervals(intervals);
  const report = summary && {
    variant: host.dataset.variant,
    viewport: `${innerWidth}x${innerHeight}`,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    chunks: `${startChunks}->${Number(host.dataset.activeChunks || 0)}`,
    ...summary,
  };
  frameResult.textContent = report ? JSON.stringify(report) : 'Sample interrupted when the match or visible tab changed.';
  sampleButton.disabled = false;
});
