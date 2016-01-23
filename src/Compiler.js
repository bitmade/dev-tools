import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import defaultsDeep from 'lodash/defaultsDeep';

export default class Compiler {

  /**
   * Creates a new compiler.
   *
   * @param {Object} config
   *    The webpack configuration, normally loaded from webpack.config.js
   *
   * @param {Object} options
   *    Contains options like stats configuration.
   */
  constructor(config, options = {}) {
    this.config = config;
    this.options = defaultsDeep(options, {
      stats: {
        colors: true,
        children: false,
        chunks: false,
        version: false,
        hash: false
      }
    });
    this.compiler = webpack(config);
  }

  watch() {
    this.compiler.watch({}, this.resultToConsole.bind(this));
  }

  run() {
    this.compiler.run(this.resultToConsole.bind(this));
  }

  middleware() {
    // Emit a warning if the public path is omitted in the configuration.
    if (!this.config.output.publicPath) {
      console.warn('No publicPath defined! WebpackDevMiddleware might not serve at the correct path.');
    }

    return WebpackDevMiddleware(this.compiler, {
      publicPath: this.config.output.publicPath,
      stats: this.options.stats
    });
  }

  resultToConsole(err, stats) {
    if (err) {
      console.error(err);
    }
    else {
      console.log(stats.toString(this.options.stats));
    }
  }
}