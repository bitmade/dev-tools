'use strict';

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

var _discoverData = require('./discoverData');

var _discoverData2 = _interopRequireDefault(_discoverData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (options) {

  var hbs = new _expressHandlebars2.default.ExpressHandlebars(options.handlebars),
      viewsPath = _path2.default.join(options.context, options.express.viewsPath),
      layoutsDir = _path2.default.relative(options.express.viewsPath, hbs.layoutsDir),
      partialsDir = _path2.default.relative(options.express.viewsPath, hbs.partialsDir),
      context = (0, _discoverData2.default)(options);

  _fsFinder2.default.from(viewsPath).exclude([layoutsDir, partialsDir]).findFiles(options.handlebars.extname).map(buildTemplateInfo).forEach(renderTemplate);

  function buildTemplateInfo(original) {

    var file = _path2.default.parse(_path2.default.relative(viewsPath, original));

    // If the filename is not index, append the name to file.dir
    var dir = file.name != 'index' ? _path2.default.join(file.dir, file.name) : file.dir;

    return {
      original: original,
      dir: _path2.default.join(options.context, options.express.staticPath, dir),
      name: 'index.html'
    };
  }

  function renderTemplate(file) {
    hbs.renderView(file.original, context, function (err, template) {
      _fsExtra2.default.ensureDir(file.dir, function () {
        _fsExtra2.default.writeFile(_path2.default.join(file.dir, file.name), template);
      });
    });
  }
};