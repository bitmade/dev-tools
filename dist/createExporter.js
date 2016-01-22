'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {

  options = (0, _defaultOptions2.default)(options);

  return {
    run: function run() {
      var compiler = (0, _webpack2.default)(options);
      compiler.run(function (err, stats) {
        return console.log(stats.toString({ colors: true }));
      });
      (0, _hbsRenderer2.default)(options);
    }
  };
};

var _defaultOptions = require('./defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _hbsRenderer = require('./hbsRenderer');

var _hbsRenderer2 = _interopRequireDefault(_hbsRenderer);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }