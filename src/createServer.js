import webpackMiddleware from 'webpack-dev-middleware';
import defaultOptions from './defaultOptions';
import getServer from './server';
import getWebpack from './webpack';

export default function (options) {

  options = defaultOptions(options);

  const compiler = getWebpack(options);
  let middlewares = [];

  // Build temporary assets using the Webpack dev middleware.
  if (!options.buildAssets) {
    middlewares.push(webpackMiddleware(compiler, options.webpackDevMiddleware));
  }
  else {
    compiler.watch({}, (err, stats) => {
      console.log(stats.toString(options.webpackDevMiddleware.stats));
    });
  }

  return getServer(options, middlewares);
}