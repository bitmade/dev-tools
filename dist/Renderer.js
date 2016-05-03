'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucksEngine = require('./nunjucksEngine');

var _nunjucksEngine2 = _interopRequireDefault(_nunjucksEngine);

var _fsFinder = require('fs-finder');

var _fsFinder2 = _interopRequireDefault(_fsFinder);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _DataDiscoverer = require('./DataDiscoverer');

var _DataDiscoverer2 = _interopRequireDefault(_DataDiscoverer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  function Renderer(context, viewsPath, settingsFile, contentDir, viewExtension, publicPath) {
    _classCallCheck(this, Renderer);

    this.context = context;
    this.viewsPath = _path2.default.join(context, viewsPath);
    this.layoutsDir = 'layouts';
    this.partialsDir = 'partials';
    this.viewExtension = viewExtension;
    this.publicPath = publicPath;
    this.data = new _DataDiscoverer2.default(context, settingsFile, contentDir).load();
    this.engine = (0, _nunjucksEngine2.default)(this.viewsPath);
  }

  _createClass(Renderer, [{
    key: 'run',
    value: function run() {
      _fsFinder2.default.from(this.viewsPath).exclude([this.layoutsDir, this.partialsDir]).findFiles(this.viewExtension).map(this.buildTemplateInfo.bind(this)).forEach(this.renderTemplate.bind(this));
    }
  }, {
    key: 'buildTemplateInfo',
    value: function buildTemplateInfo(original) {

      var file = _path2.default.parse(_path2.default.relative(this.viewsPath, original));

      // If the filename is not index, append the name to file.dir
      var dir = file.name != 'index' ? _path2.default.join(file.dir, file.name) : file.dir;

      return {
        original: original,
        dir: _path2.default.join(this.context, this.publicPath, dir),
        name: 'index.html'
      };
    }
  }, {
    key: 'renderTemplate',
    value: function renderTemplate(file) {
      this.engine.render(file.original, this.data, function (err, template) {
        _fsExtra2.default.ensureDir(file.dir, function () {
          _fsExtra2.default.writeFile(_path2.default.join(file.dir, file.name), template);
        });
      });
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;