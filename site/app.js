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
let currentGame = null;

function showGame(id, updateHistory = true) {
  const game = games[id];
  if (!game) {
    currentGame = null;
    home.hidden = false;
    player.hidden = true;
    document.body.dataset.view = 'home';
    document.title = 'LOK Demo Day — Pick a game';
    frame.src = 'about:blank'; // Unmount the previous game, including its sound and loop.
    if (updateHistory) history.pushState(null, '', '/');
    return;
  }

  window.Survivor616DemoDay?.stop(true);
  currentGame = id;
  home.hidden = true;
  player.hidden = false;
  document.body.dataset.view = id;
  playerTitle.textContent = game.title;
  playerStatus.textContent = 'Loading game…';
  loading.textContent = 'LOADING GAME…';
  loading.hidden = false;
  frame.title = `${game.title} playable demo`;
  frame.src = game.path;
  newTabLink.href = game.path;
  document.title = `Play ${game.title} — LOK Demo Day`;
  if (updateHistory) history.pushState({ game: id }, '', `/?game=${encodeURIComponent(id)}`);
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-game]').forEach((button) => {
  button.addEventListener('click', () => showGame(button.dataset.game));
});
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
