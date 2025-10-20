// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs', 'mjs');

module.exports = defaultConfig;
