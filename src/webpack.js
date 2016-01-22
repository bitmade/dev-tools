import webpack from 'webpack';

export default (options) => {

  let webpackConfig = require(options.webpack.config);

  if (webpackConfig.default) {
    webpackConfig = webpackConfig.default;
  }

  if (typeof webpackConfig == 'function') {
    webpackConfig = webpackConfig(options);
  }

  return webpack(webpackConfig);
}