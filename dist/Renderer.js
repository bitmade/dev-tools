'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _fsFinder = require('fs-finder');

var _fsFinder2 = _interopRequireDefault(_fsFinder);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _templatesHelpers = require('./templatesHelpers');

var _templatesHelpers2 = _interopRequireDefault(_templatesHelpers);

var _DataDiscoverer = require('./DataDiscoverer');

var _DataDiscoverer2 = _interopRequireDefault(_DataDiscoverer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  function Renderer(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath, defaultLayout) {
    _classCallCheck(this, Renderer);

    this.context = context;
    this.hbs = new _expressHandlebars2.default.ExpressHandlebars({
      helpers: _templatesHelpers2.default,
      defaultLayout: defaultLayout,
      extname: viewsExtension
    });
    this.viewsPath = _path2.default.join(context, viewsPath);
    this.layoutsDir = _path2.default.relative(viewsPath, this.hbs.layoutsDir);
    this.partialsDir = _path2.default.relative(viewsPath, this.hbs.partialsDir);
    this.viewsExtension = viewsExtension;
    this.publicPath = publicPath;
    this.data = new _DataDiscoverer2.default(context, settingsFile, contentDir).load();
  }

  _createClass(Renderer, [{
    key: 'run',
    value: function run() {
      _fsFinder2.default.from(this.viewsPath).exclude([this.layoutsDir, this.partialsDir]).findFiles(this.viewsExtension).map(this.buildTemplateInfo.bind(this)).forEach(this.renderTemplate.bind(this));
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
      this.hbs.renderView(file.original, this.data, function (err, template) {
        _fsExtra2.default.ensureDir(file.dir, function () {
          _fsExtra2.default.writeFile(_path2.default.join(file.dir, file.name), template);
        });
      });
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;