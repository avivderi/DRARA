const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch workspace root for monorepo dependencies and shared packages
config.watchFolders = [workspaceRoot];

// 2. Resolve node_modules from both local and root monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Prevent backend files, log files, and build artifacts from triggering Metro HMR loops
config.resolver.blockList = exclusionList([
  /\/apps\/api\/.*/,
  /\/apps\/web\/.*/,
  /\/logs\/.*/,
  /.*\.log$/,
  /\/\.pytest_cache\/.*/,
]);

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


