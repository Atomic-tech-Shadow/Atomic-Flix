const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper resolution of @babel/runtime
config.resolver.platforms = ['native', 'android', 'ios', 'web'];
config.resolver.alias = {
  '@babel/runtime': require.resolve('@babel/runtime'),
};

module.exports = config;