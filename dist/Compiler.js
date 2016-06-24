'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = function () {

  /**
   * Creates a new compiler.
   *
   * @param {Object} config
   *    The webpack configuration, normally loaded from webpack.config.js
   *
   * @param {Object} options
   *    Contains options like stats configuration.
   */

  function Compiler(config) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Compiler);

    this.config = config;
    this.options = (0, _defaultsDeep2.default)(options, {
      stats: {
        colors: true,
        children: false,
        chunks: false,
        version: false,
        hash: false
      }
    });
    this.compiler = (0, _webpack2.default)(config);
  }

  _createClass(Compiler, [{
    key: 'watch',
    value: function watch() {
      this.compiler.watch({}, this.resultToConsole.bind(this));
    }
  }, {
    key: 'run',
    value: function run() {
      this.compiler.run(this.resultToConsole.bind(this));
    }
  }, {
    key: 'middleware',
    value: function middleware() {
      // Emit a warning if the public path is omitted in the configuration.
      if (!this.config.output.publicPath) {
        console.warn('No publicPath defined! WebpackDevMiddleware might not serve at the correct path.');
      }

      return (0, _webpackDevMiddleware2.default)(this.compiler, {
        publicPath: this.config.output.publicPath,
        stats: this.options.stats
      });
    }
  }, {
    key: 'resultToConsole',
    value: function resultToConsole(err, stats) {
      if (err) {
        console.error(err);
      } else {
        console.log(stats.toString(this.options.stats));
      }
    }
  }]);

  return Compiler;
}();

exports.default = Compiler;