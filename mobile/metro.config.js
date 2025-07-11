const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimisations pour Expo.dev builds
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'bin'];

// Éviter les conflits de modules
config.resolver.disableHierarchicalLookup = true;

// Optimisations de performance
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;