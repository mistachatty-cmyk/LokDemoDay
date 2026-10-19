const SENSITIVE_PATH = /\b(login|sign-in|signin|checkout|payment|billing|account\/security)\b/i;
const SENSITIVE_FIELDS = 'input[type="password"],input[autocomplete="cc-number"],input[name*="card" i]';
const TARGETS = 'main *, article *, section *, header *, footer *, img, video, canvas, h1, h2, h3, h4, p, a, button, [data-lok-demo-media], [data-lok-sandbox-object]';
const UI_ANCESTORS = '[data-lok-nondestructible],#lok-pongfall-page,[data-lok-page-media-ui],[data-lok-page-ui],.lok-choice,[aria-hidden="true"],[inert],form';

export function canPlayPage(location, doc) {
  if (!location || SENSITIVE_PATH.test(location.pathname || '')) return false;
  return !doc?.querySelector?.(SENSITIVE_FIELDS);
}

/** Scan only visible, ordinary page content; target geometry is returned in document CSS pixels. */
export function scanPageTargetRects(doc, viewport, { maxCandidates = 1800, maxTargets = 180, margin = 160 } = {}) {
  if (!doc || !viewport || ![viewport.scrollX, viewport.scrollY, viewport.width, viewport.height, margin].every(Number.isFinite)
    || viewport.width <= 0 || viewport.height <= 0 || !Number.isInteger(maxCandidates) || maxCandidates < 0
    || !Number.isInteger(maxTargets) || maxTargets < 0 || margin < 0) return [];

  const candidates = doc.querySelectorAll(TARGETS);
  const results = [];
  const accepted = new Set();
  const count = Math.min(candidates.length, maxCandidates);
  for (let index = 0; index < count && results.length < maxTargets; index++) {
    const element = candidates[index];
    const tag = String(element?.tagName || '').toLowerCase();
    if (!element || !['img', 'video', 'canvas'].includes(tag) && !String(element.textContent || '').trim()) continue;
    if (element.isConnected === false || element.hidden || element.getAttribute?.('aria-hidden') === 'true'
      || element.getAttribute?.('inert') !== null && element.getAttribute?.('inert') !== undefined
      || element.matches?.('input,textarea,select,option,[contenteditable="true"],[role="textbox"]')
      || element.closest?.(UI_ANCESTORS)) continue;

    let parent = element.parentElement;
    let nestedInAcceptedTarget = false;
    while (parent && parent !== doc.body) {
      if (accepted.has(parent)) { nestedInAcceptedTarget = true; break; }
      parent = parent.parentElement;
    }
    if (nestedInAcceptedTarget) continue;

    const rect = element.getBoundingClientRect?.();
    if (!rect || ![rect.left, rect.top, rect.right, rect.bottom, rect.width, rect.height].every(Number.isFinite)
      || rect.width < 22 || rect.height < 16 || rect.width * rect.height > viewport.width * viewport.height * 0.62
      || rect.right < -margin || rect.bottom < -margin || rect.left > viewport.width + margin || rect.top > viewport.height + margin) continue;

    accepted.add(element);
    results.push({ element, x: rect.left + viewport.scrollX, y: rect.top + viewport.scrollY, width: rect.width, height: rect.height });
  }
  return results;
}
