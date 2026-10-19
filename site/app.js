import { BRIDGE_VERSION, validBridgeEvent } from './bridge-protocol.mjs';
import { mountGameChoices } from './game-choice.js?v=gameplay-2';
import { validateKineticPageRun } from './page-run-protocol.mjs';

const previewMotionSetting = 'lok:demoday:live-previews';
const previewMotionControls = [...document.querySelectorAll('[data-preview-motion]')];
function livePreviewsEnabled() {
  try {
    const setting = localStorage.getItem(previewMotionSetting);
    return setting === 'on' || (setting !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch { return !matchMedia('(prefers-reduced-motion: reduce)').matches; }
}
function syncPreviewMotionControls() {
  for (const control of previewMotionControls) control.checked = livePreviewsEnabled();
}
syncPreviewMotionControls();
for (const control of previewMotionControls) control.addEventListener('change', () => {
  try { localStorage.setItem(previewMotionSetting, control.checked ? 'on' : 'off'); } catch {}
  syncPreviewMotionControls();
  window.dispatchEvent(new Event('lok:preview-motion-change'));
});

const games = {
  'survivor-616': { title: 'Survivor 616', path: '/games/survivor-616/' },
  'kinetic-souls': { title: 'Kinetic Souls', path: '/games/kinetic-classic/' },
};

const home = document.getElementById('home');
const player = document.getElementById('player');
const frame = document.getElementById('game-frame');
const loading = document.getElementById('loading');
const playerTitle = document.getElementById('player-title');
const playerStatus = document.getElementById('player-status');
const newTabLink = document.getElementById('new-tab-link');
const homeMessage = document.getElementById('home-message');
const gameTip = document.getElementById('game-tip');
const gameMenu = document.getElementById('game-menu');
const pageModeMenu = document.getElementById('page-mode-menu');
const kineticVersionMenu = document.getElementById('kinetic-version-menu');
const homePlayMenu = document.getElementById('home-play-menu');
const settingsButton = document.getElementById('settings-button');
const menuTitle = document.getElementById('game-menu-title');
const menuDescription = document.getElementById('game-menu-description');
const menuCurrent = document.getElementById('game-menu-current');
const browseButton = document.getElementById('browse-demo-day');
const embedded = new URLSearchParams(location.search).get('embed') === '1';
document.body.dataset.embed = String(embedded);
let currentGame = null;
let currentVariant = 'classic';
let versionContext = 'page';
let homeChoice = 'survivor-616';
let activeRunId = null;
let runStarted = false;
let runCompleted = false;
const reportedPickups = new Set();
let inventory = [];

function postToHub(payload) {
  if (window.parent === window) return;
  for (const origin of ['https://gsix.online', 'http://localhost:3000']) {
    window.parent.postMessage(payload, origin);
  }
}

window.addEventListener('message', (event) => {
  if (event.source === window.parent && event.source !== window &&
      ['https://gsix.online', 'http://localhost:3000'].includes(event.origin)) {
    const data = event.data;
    if (data?.type === 'lok:demoday:inventory' && data.version === BRIDGE_VERSION &&
        Array.isArray(data.items) && data.items.length <= 1 &&
        data.items.every((item) => item === 'rift-fragment')) {
      inventory = [...data.items];
      sendBridgeInventory();
    }
    return;
  }
  if (event.origin !== location.origin || event.source !== frame.contentWindow ||
      !validBridgeEvent(event.data, currentGame, activeRunId)) return;
  const data = event.data;
  if (data.event === 'start') {
    runStarted = true;
    return;
  }
  if (!runStarted || runCompleted) return;
  if (data.event === 'abort') {
    beginBridgeRun();
    sendBridgeInit();
    playerStatus.textContent = 'Run ended';
    return;
  }
  if (data.event === 'pickup') {
    if (reportedPickups.has(data.pickupId)) return;
    reportedPickups.add(data.pickupId);
    postToHub({ type: 'lok:demoday:pickup', version: BRIDGE_VERSION,
      runId: activeRunId, gameKey: currentGame, itemKey: data.itemKey, pickupId: data.pickupId });
    return;
  }
  if (data.event === 'complete') {
    runCompleted = true;
    postToHub({ type: 'lok:demoday:run', version: BRIDGE_VERSION,
      runId: activeRunId, gameKey: currentGame, score: data.score,
      xp: data.xp, completedAt: data.completedAt });
    playerStatus.textContent = `Run complete · ${data.score.toLocaleString()} points`;
    beginBridgeRun();
    sendBridgeInit();
  }
});

function beginBridgeRun() {
  activeRunId = crypto.randomUUID();
  runStarted = false;
  runCompleted = false;
  reportedPickups.clear();
}

function sendBridgeInit() {
  if (!currentGame || !activeRunId || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ type: 'lok:demoday:init', version: BRIDGE_VERSION,
    gameId: currentGame, runId: activeRunId, items: inventory }, location.origin);
}

function sendBridgeInventory() {
  if (!currentGame || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ type: 'lok:demoday:inventory', version: BRIDGE_VERSION,
    gameId: currentGame, items: inventory }, location.origin);
}

// The live-page arena runs beside this page (outside the embedded game frame).
// Relay its completed match data through the same account event channel.
window.addEventListener('lok:demoday:page-run', (event) => {
  const run = validateKineticPageRun(event.detail);
  if (!run) return;
  postToHub({ type: 'lok:demoday:run', version: BRIDGE_VERSION,
    runId: run.runId, gameKey: 'kinetic-souls', score: run.score, xp: run.xp,
    completedAt: run.completedAt, variant: run.variant, durationMs: run.durationMs, matchDurationMs: run.matchDurationMs,
    teamScores: run.teamScores, result: run.result });
});

function openGameMenu() {
  menuTitle.textContent = currentGame ? 'Switch games.' : 'Choose your game.';
  menuDescription.textContent = currentGame
    ? 'Choose another game to play. Switching ends your current run.'
    : 'Jump in now. You can switch games here at any time.';
  menuCurrent.hidden = !currentGame;
  menuCurrent.textContent = currentGame ? `NOW PLAYING: ${games[currentGame].title.toUpperCase()}` : '';
  browseButton.hidden = Boolean(currentGame);
  gameMenu.querySelectorAll('[data-game]').forEach((button) => {
    const selected = button.dataset.game === currentGame;
    button.dataset.active = String(selected);
    if (selected) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
    button.querySelector('.game-menu-action').textContent = selected
      ? 'CONTINUE GAME ↗'
      : currentGame ? 'SWITCH TO GAME ↗' : 'PLAY GAME ↗';
  });
  if (!gameMenu.open) gameMenu.showModal();
  settingsButton.setAttribute('aria-expanded', 'true');
  gameMenu.querySelector('[data-game]').focus();
}

function openPageModeMenu() {
  const active = runningPageMode();
  document.getElementById('page-mode-title').textContent = active ? 'Switch page modes.' : 'Choose your game.';
  pageModeMenu.querySelectorAll('[data-page-mode]').forEach((button) => { button.dataset.active = String(button.dataset.pageMode === active); });
  if (!pageModeMenu.open) pageModeMenu.showModal();
  settingsButton.setAttribute('aria-expanded', 'true');
  pageModeMenu.querySelector('[data-page-mode]').focus();
}

function openKineticVersion(context) {
  versionContext = context;
  kineticVersionMenu.querySelector('.game-menu-head p').textContent = context === 'page'
    ? 'A spawns left, L spawns right. Both teams fight over the live website.'
    : 'Choose the complete Classic game or the expanded KS2 alpha.';
  kineticVersionMenu.showModal();
}

function runningPageMode() {
  if (window.Survivor616DemoDay?.isRunning()) return 'survivor-616';
  if (window.KineticSoulsOfficialPage?.isRunning()) return 'kinetic-souls';
  if (window.KineticSoulsPage?.isRunning()) return 'kinetic-souls';
  return null;
}

function stopPageModes() {
  window.Survivor616DemoDay?.stop(true);
  window.KineticSoulsOfficialPage?.stop();
  window.KineticSoulsPage?.stop();
}

function showGame(id, updateHistory = true, variant = 'classic') {
  const game = games[id];
  if (!game) {
    currentGame = null;
    activeRunId = null;
    home.hidden = false;
    player.hidden = true;
    document.body.dataset.view = 'home';
    document.title = 'LOK Demo Day — Pick a game';
    gameTip.hidden = true;
    frame.src = 'about:blank'; // Unmount the previous game, including its sound and loop.
    if (updateHistory) history.pushState(null, '', embedded ? '/?embed=1' : '/');
    if (!['#studio', '#progress'].includes(location.hash)) openPageModeMenu();
    return;
  }

  if (gameMenu.open) gameMenu.close();
  stopPageModes();
  currentGame = id;
  currentVariant = id === 'kinetic-souls' && variant === 'ks2' ? 'ks2' : 'classic';
  beginBridgeRun();
  home.hidden = true;
  player.hidden = false;
  document.body.dataset.view = id;
  playerTitle.textContent = id === 'kinetic-souls' ? `${game.title} ${currentVariant === 'ks2' ? '2 · Alpha' : 'Classic'}` : game.title;
  gameTip.hidden = id !== 'kinetic-souls';
  if (id === 'kinetic-souls') {
    gameTip.textContent = 'A spawns the left team · L spawns the right team. Open Settings for opponents, modifiers, and the Bestiary.';
  }
  playerStatus.textContent = 'Loading game…';
  loading.textContent = 'LOADING GAME…';
  loading.hidden = false;
  frame.title = `${game.title} playable demo`;
  const path = id === 'kinetic-souls' ? `/games/kinetic-${currentVariant}/` : game.path;
  frame.src = path;
  newTabLink.href = path;
  document.title = `Play ${game.title} — LOK Demo Day`;
  if (updateHistory) history.pushState({ game: id, variant: currentVariant }, '', `/?game=${encodeURIComponent(id)}${id === 'kinetic-souls' ? `&variant=${currentVariant}` : ''}${embedded ? '&embed=1' : ''}`);
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-game]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.game === 'kinetic-souls') { if (gameMenu.open) gameMenu.close(); openKineticVersion('full'); return; }
    if (button.dataset.game === currentGame) {
      gameMenu.close();
      return;
    }
    showGame(button.dataset.game);
  });
});
document.querySelectorAll('[data-home-game]').forEach((button) => button.addEventListener('click', () => {
  homeChoice = button.dataset.homeGame;
  document.getElementById('home-play-title').textContent = games[homeChoice].title;
  document.getElementById('home-play-description').textContent = `Choose how to play ${games[homeChoice].title}.`;
  homePlayMenu.querySelector('[data-home-route="full"] .game-menu-action').textContent = homeChoice === 'kinetic-souls' ? 'CHOOSE VERSION ↗' : 'PLAY SURVIVOR ↗';
  homePlayMenu.showModal();
  homePlayMenu.querySelector('[data-home-route="page"]').focus();
}));
homePlayMenu.querySelectorAll('[data-home-route]').forEach((button) => button.addEventListener('click', () => {
  const route = button.dataset.homeRoute;
  homePlayMenu.close();
  if (homeChoice === 'kinetic-souls') {
    openKineticVersion(route === 'page' ? 'page' : 'full');
  } else if (route === 'page') void startPageMode('survivor-616');
  else showGame('survivor-616');
}));
document.getElementById('close-home-play').addEventListener('click', () => homePlayMenu.close());
homePlayMenu.addEventListener('click', (event) => { if (event.target === homePlayMenu) homePlayMenu.close(); });
settingsButton.addEventListener('click', () => currentGame ? openGameMenu() : openPageModeMenu());
document.getElementById('close-game-menu').addEventListener('click', () => gameMenu.close());
browseButton.addEventListener('click', () => gameMenu.close());
gameMenu.addEventListener('click', (event) => {
  if (event.target === gameMenu) gameMenu.close();
});
gameMenu.addEventListener('close', () => settingsButton.setAttribute('aria-expanded', 'false'));
document.getElementById('close-page-mode-menu').addEventListener('click', () => pageModeMenu.close());
document.getElementById('browse-page-mode').addEventListener('click', () => pageModeMenu.close());
pageModeMenu.addEventListener('click', (event) => { if (event.target === pageModeMenu) pageModeMenu.close(); });
pageModeMenu.addEventListener('close', () => settingsButton.setAttribute('aria-expanded', 'false'));
document.getElementById('back-button').addEventListener('click', () => showGame(null));
document.getElementById('restart-button').addEventListener('click', () => {
  if (!currentGame) return;
  beginBridgeRun();
  loading.textContent = 'RESTARTING GAME…';
  loading.hidden = false;
  playerStatus.textContent = 'Restarting game…';
  frame.src = `${currentGame === 'kinetic-souls' ? `/games/kinetic-${currentVariant}/` : games[currentGame].path}?restart=${Date.now()}`;
});
frame.addEventListener('load', () => {
  if (!currentGame) return;
  let loadedGame = false;
  try {
    loadedGame = frame.contentWindow.location.pathname === (currentGame === 'kinetic-souls' ? `/games/kinetic-${currentVariant}/` : games[currentGame].path)
      && Boolean(frame.contentDocument?.getElementById('root'));
  } catch {
    // Browser error pages and external navigations cannot be inspected.
  }
  if (!loadedGame) {
    loading.textContent = 'GAME COULD NOT LOAD — TRY RESTART';
    playerStatus.textContent = 'Game could not load. Try Restart or New Tab.';
    return;
  }
  loading.hidden = true;
  playerStatus.textContent = 'Game ready';
  sendBridgeInit();
});
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(location.search);
  showGame(params.get('game'), false, params.get('variant'));
});

const overlayLoading = {};
function loadOverlay(mode) {
  const api = mode === 'survivor-616' ? 'Survivor616DemoDay' : mode === 'experimental-shooter' ? 'KineticSoulsPage' : 'KineticSoulsOfficialPage';
  if (window[api]) return Promise.resolve();
  if (!overlayLoading[mode]) {
    overlayLoading[mode] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = mode === 'survivor-616' ? '/demoday.js' : mode === 'experimental-shooter' ? '/kinetic-page.js' : '/kinetic-official-page.js';
      script.onload = () => window[api] ? resolve() : reject(new Error('Demo failed to initialize.'));
      script.onerror = () => reject(new Error('Demo failed to load.'));
      document.head.append(script);
    }).catch((error) => {
      delete overlayLoading[mode];
      throw error;
    });
  }
  return overlayLoading[mode];
}
document.getElementById('takeover-button').addEventListener('click', openPageModeMenu);
document.getElementById('page-media-file').addEventListener('change', (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  const result = window.LokDemoDayMedia?.addFile(file) || { ok: false, reason: 'Media tools did not load.' };
  document.getElementById('page-media-status').textContent = result.ok
    ? `${file.name} is on this live page. Move it, then choose Survivor 616 or Kinetic Souls.`
    : result.reason;
  event.currentTarget.value = '';
});
pageModeMenu.querySelectorAll('[data-page-mode]').forEach((button) => button.addEventListener('click', async () => {
  const mode = button.dataset.pageMode;
  pageModeMenu.close();
  if (mode === 'kinetic-souls') { openKineticVersion('page'); return; }
  await startPageMode(mode);
}));
document.getElementById('close-kinetic-version').addEventListener('click', () => kineticVersionMenu.close());
kineticVersionMenu.querySelectorAll('[data-kinetic-variant]').forEach((button) => button.addEventListener('click', () => {
  const variant = button.dataset.kineticVariant;
  kineticVersionMenu.close();
  if (versionContext === 'full') showGame('kinetic-souls', true, variant);
  else void startPageMode('kinetic-souls', variant);
}));
async function startPageMode(mode, variant = 'classic') {
  homeMessage.textContent = `Starting ${mode === 'survivor-616' ? 'Survivor 616' : mode === 'experimental-shooter' ? 'Experimental shooter' : `Kinetic Souls ${variant}`} over this page…`;
  try {
    stopPageModes();
    await loadOverlay(mode);
    const result = window[mode === 'survivor-616' ? 'Survivor616DemoDay' : mode === 'experimental-shooter' ? 'KineticSoulsPage' : 'KineticSoulsOfficialPage'].start({ variant });
    homeMessage.textContent = result?.reason ? `Could not start: ${result.reason}` : '';
  } catch (error) {
    homeMessage.textContent = error.message;
  }
}

showGame(new URLSearchParams(location.search).get('game'), false, new URLSearchParams(location.search).get('variant'));
mountGameChoices();
