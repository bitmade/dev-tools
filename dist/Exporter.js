'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpackConfig = require('webpack-config');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _Compiler = require('./Compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exporter = function () {
  function Exporter(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath, webpackConfig) {
    _classCallCheck(this, Exporter);

    this.compiler = new _Compiler2.default(new _webpackConfig2.default().extend(webpackConfig));
    this.renderer = new _Renderer2.default(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath);
  }

  _createClass(Exporter, [{
    key: 'runAssetCompiler',
    value: function runAssetCompiler() {
      this.compiler.run();
    }
  }, {
    key: 'runTemplateRenderer',
    value: function runTemplateRenderer() {
      this.renderer.run();
    }
  }, {
    key: 'runAll',
    value: function runAll() {
      this.runAssetCompiler();
      this.runTemplateRenderer();
    }
  }]);

  return Exporter;
}();

exports.default = Exporter;