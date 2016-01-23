'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  // @todo Remove this.
  options = (0, _defaultOptions2.default)(options);

  return {
    run: function run() {
      // @todo How should config loading be handled?
      var compiler = new _Compiler2.default((0, _Compiler.loadConfig)(options.webpack.config));
      compiler.run();
      // @todo Pass only the variables needed.
      (0, _hbsRenderer2.default)(options);
    }
  };
};

var _defaultOptions = require('./defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _hbsRenderer = require('./hbsRenderer');

var _hbsRenderer2 = _interopRequireDefault(_hbsRenderer);

var _Compiler = require('./Compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }