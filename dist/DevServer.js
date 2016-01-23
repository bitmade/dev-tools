'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpackConfig = require('webpack-config');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _Server = require('./Server');

var _Server2 = _interopRequireDefault(_Server);

var _Compiler = require('./Compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DevServer = function () {
  function DevServer(context, webpackConfig) {
    var buildAssets = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, DevServer);

    this.context = context;
    this.webpackConfig = webpackConfig;
    this.buildAssets = buildAssets;

    this.compiler = new _Compiler2.default(new _webpackConfig2.default().extend(this.webpackConfig));
    this.server = new _Server2.default(this.context);

    // Build temporary assets using the Webpack dev middleware.
    this.buildAssets ? this.server.use(this.compiler.middleware()) : this.compiler.watch();
  }

  _createClass(DevServer, [{
    key: 'listen',
    value: function listen(port) {
      this.server.listen(port);
    }
  }]);

  return DevServer;
}();

exports.default = DevServer;