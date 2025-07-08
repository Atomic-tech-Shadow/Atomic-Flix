const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for package.json exports compatibility
config.resolver.unstable_enablePackageExports = false;

module.exports = config;