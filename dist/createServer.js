'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {

  options = (0, _defaultOptions2.default)(options);

  var compiler = (0, _webpack2.default)(options);
  var middlewares = [];

  // Build temporary assets using the Webpack dev middleware.
  if (!options.buildAssets) {
    middlewares.push((0, _webpackDevMiddleware2.default)(compiler, options.webpackDevMiddleware));
  } else {
    compiler.watch({}, function (err, stats) {
      console.log(stats.toString(options.webpackDevMiddleware.stats));
    });
  }

  return (0, _server2.default)(options, middlewares);
};

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _defaultOptions = require('./defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }