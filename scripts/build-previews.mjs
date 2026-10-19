import { build } from '../games/kinetic-official/classic/node_modules/esbuild/lib/main.js';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const survivorSource = resolve(root, 'games/survivor-616/artifacts/survivor-616/src');
const common = { bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, logLevel: 'warning' };

await build({
  ...common,
  entryPoints: [resolve(root, 'previews/survivor.ts')],
  outfile: resolve(root, 'dist/survivor-preview.js'),
  alias: { '@': survivorSource },
});
await build({
  ...common,
  entryPoints: [resolve(root, 'previews/kinetic.ts')],
  outfile: resolve(root, 'dist/kinetic-preview.js'),
});
await build({
  ...common,
  entryPoints: [resolve(root, 'previews/pongfall.ts')],
  outfile: resolve(root, 'dist/pongfall-preview.js'),
});
await build({
  ...common,
  entryPoints: [resolve(root, 'previews/pongfall-page.ts')],
  outfile: resolve(root, 'dist/pongfall-page.js'),
});
