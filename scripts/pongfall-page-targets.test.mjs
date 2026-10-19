import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canPlayPage, scanPageTargetRects } from '../site/pongfall-page-targets.mjs';

function element(tagName, rect, { text = 'Page content', attrs = {}, parents = [], connected = true } = {}) {
  const ancestor = new Set(parents);
  return {
    tagName,
    textContent: text,
    isConnected: connected,
    hidden: false,
    parentElement: null,
    getBoundingClientRect: () => rect,
    getAttribute: name => attrs[name] ?? null,
    matches: selector => selector.split(',').some(item => item.trim() === tagName.toLowerCase()),
    closest: selector => selector.split(',').some(item => ancestor.has(item.trim())) ? {} : null,
  };
}

const view = { scrollX: 20, scrollY: 100, width: 500, height: 400 };
const safeDoc = nodes => ({ querySelectorAll: () => nodes, querySelector: () => null });

test('scans visible content into stable document-space rectangles', () => {
  const text = element('P', { left: 40, top: 120, right: 180, bottom: 180, width: 140, height: 60 });
  const image = element('IMG', { left: 300, top: 220, right: 420, bottom: 300, width: 120, height: 80 }, { text: '' });
  const offscreen = element('H2', { left: 40, top: 900, right: 200, bottom: 950, width: 160, height: 50 });
  assert.deepEqual(scanPageTargetRects(safeDoc([text, image, offscreen]), view).map(({ x, y, width, height }) => ({ x, y, width, height })), [
    { x: 60, y: 220, width: 140, height: 60 },
    { x: 320, y: 320, width: 120, height: 80 },
  ]);
});

test('skips game UI, hidden content, form controls, and empty boxes', () => {
  const gameUi = element('BUTTON', { left: 40, top: 120, right: 180, bottom: 180, width: 140, height: 60 }, { parents: ['[data-lok-nondestructible]'] });
  const hiddenParent = element('P', { left: 40, top: 120, right: 180, bottom: 180, width: 140, height: 60 }, { parents: ['[aria-hidden="true"]'] });
  const formContent = element('P', { left: 40, top: 120, right: 180, bottom: 180, width: 140, height: 60 }, { parents: ['form'] });
  const hidden = element('P', { left: 40, top: 120, right: 180, bottom: 180, width: 140, height: 60 }, { attrs: { 'aria-hidden': 'true' } });
  const input = element('INPUT', { left: 40, top: 120, right: 180, bottom: 180, width: 140, height: 60 });
  const empty = element('P', { left: 40, top: 120, right: 45, bottom: 125, width: 5, height: 5 });
  assert.deepEqual(scanPageTargetRects(safeDoc([gameUi, hiddenParent, formContent, hidden, input, empty]), view), []);
});

test('bounds candidate examination and returned target count', () => {
  const nodes = Array.from({ length: 8 }, (_, i) => element('P', { left: 25 + i * 30, top: 130, right: 50 + i * 30, bottom: 160, width: 25, height: 30 }));
  assert.equal(scanPageTargetRects(safeDoc(nodes), view, { maxCandidates: 4, maxTargets: 2 }).length, 2);
});

test('refuses account, authentication, checkout, and payment pages', () => {
  assert.equal(canPlayPage({ pathname: '/checkout' }, safeDoc([])), false);
  assert.equal(canPlayPage({ pathname: '/shop/item' }, { ...safeDoc([]), querySelector: selector => selector.includes('password') ? {} : null }), false);
  assert.equal(canPlayPage({ pathname: '/news' }, safeDoc([])), true);
});
