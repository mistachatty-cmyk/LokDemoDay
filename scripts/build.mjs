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
}, null, 2));

for (const item of ['index.html', 'style.css', 'app.js', 'demoday.js',
  'games/survivor-616/index.html', 'games/kinetic-souls/index.html']) {
  if (!existsSync(resolve(dist, item))) throw new Error(`Missing deploy output: ${item}`);
}

console.log('\nDemo Day build is ready in dist/.');
