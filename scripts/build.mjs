import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const pnpm = resolve(root, 'node_modules', '.bin', process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm');

function run(command, args, cwd, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...extraEnv },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed in ${cwd} (${result.status})`);
}

function revision(cwd) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Could not read the revision in ${cwd}`);
  return result.stdout.trim();
}

function buildGame({ name, folder, packageName, basePath, output, extraEnv = {} }) {
  const cwd = resolve(root, 'games', folder);
  if (!existsSync(resolve(cwd, 'pnpm-lock.yaml'))) {
    throw new Error(`Missing ${name} submodule. Run git submodule update --init --recursive.`);
  }
  console.log(`\nBuilding ${name} at ${revision(cwd).slice(0, 12)}...`);
  run(pnpm, ['install', '--frozen-lockfile', '--filter', `${packageName}...`], cwd);
  run(pnpm, ['--filter', packageName, 'run', 'build'], cwd, { BASE_PATH: basePath, ...extraEnv });
  const source = resolve(cwd, output);
  if (!existsSync(join(source, 'index.html'))) throw new Error(`${name} did not produce ${source}/index.html`);
  cpSync(source, resolve(dist, 'games', folder), { recursive: true });
  return { revision: revision(cwd), output: source };
}

if (!existsSync(pnpm)) throw new Error('pnpm is missing. Run npm ci in the LokDemoDay root.');
if (dirname(dist) !== root) throw new Error('Output path escaped the repository.');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(resolve(root, 'site'), dist, { recursive: true });

const survivor = buildGame({
  name: 'Survivor 616',
  folder: 'survivor-616',
  packageName: '@workspace/survivor-616',
  basePath: '/games/survivor-616/',
  output: 'artifacts/survivor-616/dist/public',
});

const kinetic = buildGame({
  name: 'Kinetic Souls',
  folder: 'kinetic-souls',
  packageName: '@workspace/kinetic-souls',
  basePath: '/games/kinetic-souls/',
  output: 'artifacts/kinetic-souls/dist/public',
  extraEnv: { PORT: '3000' },
});

const kineticRoot = resolve(root, 'games', 'kinetic-souls');
run(pnpm, ['--filter', '@workspace/kinetic-souls', 'run', 'build:page-overlay'], kineticRoot);
const kineticOverlay = resolve(kineticRoot, 'artifacts/kinetic-souls/dist/overlay/kinetic-page.js');
if (!existsSync(kineticOverlay)) throw new Error('Kinetic Souls did not produce its page arena bundle.');
cpSync(kineticOverlay, resolve(dist, 'kinetic-page.js'));

// The primary page battle and both original full arenas come from one reviewed
// Classic/KS2 revision. The previous shooter remains available as Experimental.
const officialRoot = resolve(root, 'games', 'kinetic-official');
if (!existsSync(resolve(officialRoot, 'classic', 'package-lock.json')) || !existsSync(resolve(officialRoot, 'ks2', 'package-lock.json'))) {
  throw new Error('Missing official Kinetic submodule. Run git submodule update --init --recursive.');
}
for (const variant of ['classic', 'ks2']) {
  const cwd = resolve(officialRoot, variant);
  console.log(`\nBuilding Kinetic ${variant} at ${revision(officialRoot).slice(0, 12)}...`);
  run('npm', ['ci'], cwd);
  run('npm', ['run', 'build'], cwd);
  cpSync(resolve(cwd, 'dist'), resolve(dist, 'games', `kinetic-${variant}`), { recursive: true });
}
run('npm', ['run', 'build:page'], resolve(officialRoot, 'classic'));
const officialPage = resolve(officialRoot, 'classic', 'dist-page', 'kinetic-official-page.js');
if (!existsSync(officialPage)) throw new Error('Official Kinetic page mode was not built.');
cpSync(officialPage, resolve(dist, 'kinetic-official-page.js'));

// The Survivor game also exposes public media and a standalone page-takeover
// bundle at root-relative URLs. Keep these URLs working on the Demo Day domain.
for (const item of ['art', 'music', 'lok-soundtrack.json', 'lok-updates.json', 'demoday.js']) {
  const source = resolve(survivor.output, item);
  if (!existsSync(source)) throw new Error(`Missing Survivor public asset: ${item}`);
  cpSync(source, resolve(dist, item), { recursive: true });
}

writeFileSync(resolve(dist, 'build.json'), JSON.stringify({
  survivor616: survivor.revision,
  kineticSouls: kinetic.revision,
  kineticOfficial: revision(officialRoot),
}, null, 2));

for (const item of ['index.html', 'style.css', 'app.js', 'bridge-protocol.mjs', 'studio.css', 'studio.js', 'studio-projects.mjs', 'page-chooser.js', 'page-media.js', 'demoday.js', 'kinetic-page.js', 'kinetic-official-page.js',
  'games/survivor-616/index.html', 'games/kinetic-souls/index.html', 'games/kinetic-classic/index.html', 'games/kinetic-ks2/index.html']) {
  if (!existsSync(resolve(dist, item))) throw new Error(`Missing deploy output: ${item}`);
}

await import('./verify-output.mjs');
console.log('\nDemo Day build is ready in dist/.');
