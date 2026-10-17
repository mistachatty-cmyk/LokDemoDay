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
const settingsButton = document.getElementById('settings-button');
const menuTitle = document.getElementById('game-menu-title');
const menuDescription = document.getElementById('game-menu-description');
const menuCurrent = document.getElementById('game-menu-current');
const browseButton = document.getElementById('browse-demo-day');
const embedded = new URLSearchParams(location.search).get('embed') === '1';
document.body.dataset.embed = String(embedded);
let currentGame = null;

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

function showGame(id, updateHistory = true) {
  const game = games[id];
  if (!game) {
    currentGame = null;
    home.hidden = false;
    player.hidden = true;
    document.body.dataset.view = 'home';
    document.title = 'LOK Demo Day — Pick a game';
    gameTip.hidden = true;
    frame.src = 'about:blank'; // Unmount the previous game, including its sound and loop.
    if (updateHistory) history.pushState(null, '', embedded ? '/?embed=1' : '/');
    if (!['#studio', '#progress'].includes(location.hash)) openGameMenu();
    return;
  }

  if (gameMenu.open) gameMenu.close();
  window.Survivor616DemoDay?.stop(true);
  currentGame = id;
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
settingsButton.addEventListener('click', openGameMenu);
document.getElementById('close-game-menu').addEventListener('click', () => gameMenu.close());
browseButton.addEventListener('click', () => gameMenu.close());
gameMenu.addEventListener('click', (event) => {
  if (event.target === gameMenu) gameMenu.close();
});
gameMenu.addEventListener('close', () => settingsButton.setAttribute('aria-expanded', 'false'));
document.getElementById('back-button').addEventListener('click', () => showGame(null));
document.getElementById('restart-button').addEventListener('click', () => {
  if (!currentGame) return;
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
});
window.addEventListener('popstate', () => {
  showGame(new URLSearchParams(location.search).get('game'), false);
});

let overlayLoading;
function loadOverlay() {
  if (window.Survivor616DemoDay) return Promise.resolve();
  if (!overlayLoading) {
    overlayLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/demoday.js';
      script.onload = () => window.Survivor616DemoDay ? resolve() : reject(new Error('Demo failed to initialize.'));
      script.onerror = () => reject(new Error('Demo failed to load.'));
      document.head.append(script);
    }).catch((error) => {
      overlayLoading = null;
      throw error;
    });
  }
  return overlayLoading;
}
document.getElementById('takeover-button').addEventListener('click', async () => {
  homeMessage.textContent = 'Starting page takeover…';
  try {
    await loadOverlay();
    const result = window.Survivor616DemoDay.start();
    homeMessage.textContent = result?.reason ? `Could not start: ${result.reason}` : '';
  } catch (error) {
    homeMessage.textContent = error.message;
  }
});

showGame(new URLSearchParams(location.search).get('game'), false);
