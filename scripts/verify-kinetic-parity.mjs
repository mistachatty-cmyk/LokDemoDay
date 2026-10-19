import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const official = resolve(root, 'games', 'kinetic-official');
const files = {
  classic: readFileSync(resolve(official, 'classic', 'src', 'pages', 'KineticSouls.tsx'), 'utf8'),
  ks2Page: readFileSync(resolve(official, 'ks2', 'src', 'pages', 'KineticSouls.tsx'), 'utf8'),
  ks2Ui: readFileSync(resolve(official, 'ks2', 'src', 'render', 'DrawUI.ts'), 'utf8'),
  ks2Types: readFileSync(resolve(official, 'ks2', 'src', 'game', 'types.ts'), 'utf8'),
  page: readFileSync(resolve(official, 'page-mode', 'main.ts'), 'utf8'),
};

function typeValues(source, name) {
  const match = source.match(new RegExp(`(?:export\\s+)?type\\s+${name}\\s*=([\\s\\S]*?);`));
  if (!match) throw new Error(`Could not find source type ${name}`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

function arrayValues(name) {
  const match = files.page.match(new RegExp(`const\\s+${name}\\s*=\\s*\\[([^\\]]*)\\]`));
  if (!match) throw new Error(`Could not find page adapter catalog ${name}`);
  const spread = [...match[1].matchAll(/\.\.\.([A-Za-z_$][\w$]*)/g)].flatMap((item) => arrayValues(item[1]));
  return [...spread, ...[...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])];
}

function sourceValueArray(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) throw new Error(`Could not find source UI catalog ${name}`);
  return [...match[1].matchAll(/value:\s*"([^"]+)"/g)].map((item) => item[1]);
}

function sourceObjectKeys(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*:\\s*Record<string,\\s*string>\\s*=\\s*\\{([^}]+)\\}`));
  if (!match) throw new Error(`Could not find source UI map ${name}`);
  return [...match[1].matchAll(/([a-z0-9_]+):\s*"/g)].map((item) => item[1]);
}

function ks2ArenaEnvironmentValues() {
  const start = files.ks2Ui.indexOf('label: "ENVIRONMENT", key: "env"');
  if (start < 0) throw new Error('Could not find the KS2 arena environment menu');
  const end = files.ks2Ui.indexOf('\n  },', start);
  return [...files.ks2Ui.slice(start, end < 0 ? undefined : end).matchAll(/value:\s*"([^"]+)"/g)].map((item) => item[1]);
}

function assertSameSet(label, actual, expected) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = [...expectedSet].filter((value) => !actualSet.has(value));
  const extra = [...actualSet].filter((value) => !expectedSet.has(value));
  if (missing.length || extra.length || actualSet.size !== actual.length) {
    throw new Error(`${label} drifted from the source game (missing: ${missing.join(', ') || 'none'}; extra/duplicate: ${extra.join(', ') || 'none'})`);
  }
}

const classicThemeSource = sourceValueArray(files.classic, 'allThemes');
const classicModifierSource = sourceValueArray(files.classic, 'allMods');
const classicEnvironmentSource = sourceValueArray(files.classic, 'allEnvs');
const classicWeaponSource = sourceValueArray(files.classic, 'allWeps');
const ks2ThemeSource = sourceObjectKeys(files.ks2Page, 'themeMap');
const ks2ModifierSource = sourceObjectKeys(files.ks2Page, 'modMap');
const ks2EnvironmentSource = ks2ArenaEnvironmentValues();
const ks2WeaponSource = sourceObjectKeys(files.ks2Page, 'wepMap');
const classicThemeTypes = typeValues(files.classic, 'ThemeMode');
const ks2ThemeTypes = typeValues(files.ks2Types, 'ThemeMode');
const ks2EnvironmentTypes = typeValues(files.ks2Types, 'Environment');

assertSameSet('Classic themes', arrayValues('classicThemes'), classicThemeSource);
assertSameSet('KS2 themes', arrayValues('ks2Themes'), ks2ThemeSource);
assertSameSet('Classic native modifiers', arrayValues('classicNativeModifiers'), classicModifierSource);
assertSameSet('KS2 native modifiers', arrayValues('ks2NativeModifiers'), ks2ModifierSource);
assertSameSet('Classic modifier menu', arrayValues('classicModifiers'), [...classicModifierSource, ...arrayValues('pageOnlyModifiers')]);
assertSameSet('KS2 modifier menu', arrayValues('ks2Modifiers'), [...ks2ModifierSource, ...arrayValues('pageOnlyModifiers')]);
assertSameSet('Classic environments', arrayValues('classicEnvironments'), classicEnvironmentSource);
assertSameSet('KS2 environments', arrayValues('ks2Environments'), ks2EnvironmentSource);
assertSameSet('Weapon styles', arrayValues('weapons'), classicWeaponSource);
assertSameSet('Classic and KS2 weapon styles', classicWeaponSource, ks2WeaponSource);

for (const theme of [...arrayValues('classicThemes'), ...arrayValues('ks2Themes')]) {
  if (!classicThemeTypes.includes(theme) && !ks2ThemeTypes.includes(theme)) throw new Error(`Theme ${theme} is not in either game's source type`);
}
for (const environment of arrayValues('ks2Environments')) {
  if (!ks2EnvironmentTypes.includes(environment)) throw new Error(`KS2 environment ${environment} is not in its source type`);
}
for (const adaptedEnvironment of ['solar_flares', 'magnetic_fields', 'void_storm']) {
  if (!files.page.includes(`settings.environment === "${adaptedEnvironment}"`)) {
    throw new Error(`KS2 page-mode environment ${adaptedEnvironment} is listed without an implementation`);
  }
}
const pageAdaptations = arrayValues('pageOnlyModifiers');
assertSameSet('Classic and KS2 page-only modifier adaptations', pageAdaptations, ['gravity_well', 'time_distortion', 'chaos_vortex']);
for (const adaptation of pageAdaptations) {
  if (!typeValues(files.ks2Types, 'LokModifier').includes(adaptation) || !files.page.includes(`"${adaptation}"`)) {
    throw new Error(`Page-only modifier ${adaptation} is missing its KS2 source behavior`);
  }
}
if (!files.page.includes('· PAGE MODE') || !files.page.includes('const entries = this.variant === "classic" ? classicBestiary : ks2Bestiary')) {
  throw new Error('Classic adaptation labels or version-specific Bestiary data are missing');
}

console.log(`Kinetic parity checked against both games' visible UI catalogs: Classic ${classicThemeSource.length} themes / ${classicModifierSource.length} native modifiers / ${classicEnvironmentSource.length} environments; KS2 ${ks2ThemeSource.length} themes / ${ks2ModifierSource.length} native modifiers / ${ks2EnvironmentSource.length} environments; ${pageAdaptations.length} labeled page-only modifier adaptations; ${classicWeaponSource.length} shared weapon styles.`);
