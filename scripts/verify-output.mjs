import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const games = ['survivor-616', 'kinetic-souls', 'kinetic-classic', 'kinetic-ks2', 'pongfall'];

function requireFile(path) {
  if (!existsSync(path) || !statSync(path).isFile() || statSync(path).size === 0) {
    throw new Error(`Missing or empty deploy file: ${path}`);
  }
}

for (const asset of ['index.html', 'app.js', 'style.css', 'game-choice.js', 'game-choice.css', 'survivor-preview.js', 'kinetic-preview.js', 'pongfall-preview.js', 'favicon.svg', 'demoday.js', 'kinetic-official-page.js']) {
  requireFile(resolve(dist, asset));
}

for (const game of games) {
  const index = resolve(dist, 'games', game, 'index.html');
  requireFile(index);
  const html = readFileSync(index, 'utf8');
  const base = `https://demo.local/games/${game}/`;
  for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|data:|#|mailto:)/i.test(reference)) continue;
    const path = new URL(reference, base).pathname;
    const local = resolve(dist, `.${path}`);
    if (!local.startsWith(`${dist}\\`) && !local.startsWith(`${dist}/`)) {
      throw new Error(`Asset URL escaped dist: ${reference}`);
    }
    requireFile(local);
  }
}

const revisions = JSON.parse(readFileSync(resolve(dist, 'build.json'), 'utf8'));
for (const revision of [revisions.survivor616, revisions.kineticSouls, revisions.kineticOfficial, revisions.pongfall]) {
  if (!/^[0-9a-f]{40}$/.test(revision)) throw new Error('Invalid game revision in build.json');
}

console.log('Verified all pinned game entry points and their static asset URLs.');
