import { BRIDGE_VERSION, validBridgeEvent } from './bridge-protocol.mjs';

const games = {
  'survivor-616': { title: 'Survivor 616', path: '/games/survivor-616/' },
  'kinetic-souls': { title: 'Kinetic Souls', path: '/games/kinetic-souls/' },
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
const settingsButton = document.getElementById('settings-button');
const menuTitle = document.getElementById('game-menu-title');
const menuDescription = document.getElementById('game-menu-description');
const menuCurrent = document.getElementById('game-menu-current');
const browseButton = document.getElementById('browse-demo-day');
const embedded = new URLSearchParams(location.search).get('embed') === '1';
document.body.dataset.embed = String(embedded);
let currentGame = null;
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

function runningPageMode() {
  if (window.Survivor616DemoDay?.isRunning()) return 'survivor-616';
  if (window.KineticSoulsPage?.isRunning()) return 'kinetic-souls';
  return null;
}

function stopPageModes() {
  window.Survivor616DemoDay?.stop(true);
  window.KineticSoulsPage?.stop();
}

function showGame(id, updateHistory = true) {
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
  beginBridgeRun();
  home.hidden = true;
  player.hidden = false;
  document.body.dataset.view = id;
  playerTitle.textContent = game.title;
  gameTip.hidden = id !== 'kinetic-souls';
  if (id === 'kinetic-souls') {
    gameTip.textContent = 'SOLO PLAY: Choose “vs Bot,” then Start Game. A spawns P1 · Q toggles auto-spawn · P pauses. On touch, enable Mobile Controls inside the game.';
  }
  playerStatus.textContent = 'Loading game…';
  loading.textContent = 'LOADING GAME…';
  loading.hidden = false;
  frame.title = `${game.title} playable demo`;
  frame.src = game.path;
  newTabLink.href = game.path;
  document.title = `Play ${game.title} — LOK Demo Day`;
  if (updateHistory) history.pushState({ game: id }, '', `/?game=${encodeURIComponent(id)}${embedded ? '&embed=1' : ''}`);
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-game]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.game === currentGame) {
      gameMenu.close();
      return;
    }
    showGame(button.dataset.game);
  });
});
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
  frame.src = `${games[currentGame].path}?restart=${Date.now()}`;
});
frame.addEventListener('load', () => {
  if (!currentGame) return;
  let loadedGame = false;
  try {
    loadedGame = frame.contentWindow.location.pathname === games[currentGame].path
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
  showGame(new URLSearchParams(location.search).get('game'), false);
});

const overlayLoading = {};
function loadOverlay(mode) {
  const api = mode === 'survivor-616' ? 'Survivor616DemoDay' : 'KineticSoulsPage';
  if (window[api]) return Promise.resolve();
  if (!overlayLoading[mode]) {
    overlayLoading[mode] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = mode === 'survivor-616' ? '/demoday.js' : '/kinetic-page.js';
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
pageModeMenu.querySelectorAll('[data-page-mode]').forEach((button) => button.addEventListener('click', async () => {
  const mode = button.dataset.pageMode;
  pageModeMenu.close();
  homeMessage.textContent = `Starting ${games[mode].title} over this page…`;
  try {
    stopPageModes();
    await loadOverlay(mode);
    const result = window[mode === 'survivor-616' ? 'Survivor616DemoDay' : 'KineticSoulsPage'].start();
    homeMessage.textContent = result?.reason ? `Could not start: ${result.reason}` : '';
  } catch (error) {
    homeMessage.textContent = error.message;
  }
}));

showGame(new URLSearchParams(location.search).get('game'), false);
