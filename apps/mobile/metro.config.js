const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'crypto') {
    return {
      filePath: require.resolve('crypto-browserify'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'stream') {
    return {
      filePath: require.resolve('stream-browserify'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
