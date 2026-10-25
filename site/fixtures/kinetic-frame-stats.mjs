export function summarizeFrameIntervals(intervals) {
  const values = intervals.filter(value => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  if (values.length < 30) return null;
  const percentile = share => Number(values[Math.floor((values.length - 1) * share)].toFixed(1));
  return {
    frames: values.length,
    p50Ms: percentile(0.5),
    p95Ms: percentile(0.95),
    maxMs: percentile(1),
    over33Ms: values.filter(value => value > 33.4).length,
  };
}
