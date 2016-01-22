'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (options) {

  var webpackConfig = require(options.webpack.config);

  if (webpackConfig.default) {
    webpackConfig = webpackConfig.default;
  }

  if (typeof webpackConfig == 'function') {
    webpackConfig = webpackConfig(options);
  }

  return (0, _webpack2.default)(webpackConfig);
};