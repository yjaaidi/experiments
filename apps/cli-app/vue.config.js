module.exports = {
  outputDir: '../../dist/apps/cli-app',
  chainWebpack(config) {
    config.resolve.alias.delete('@');
    config.resolve
      .plugin('tsconfig-paths')
      .use(require('tsconfig-paths-webpack-plugin'));
  },
};
