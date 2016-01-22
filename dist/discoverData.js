'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {

  var data = {};

  var settingsPath = _path2.default.join(options.context, options.settingsFile),
      contentPath = _path2.default.join(options.context, options.contentDir);

  function namespaceFromFile(file) {
    file.namespace = _path2.default.relative(options.context, file.dir).replace(/\//, '.');
    return file;
  }

  function parseContent(file) {
    var _fm = (0, _frontMatter2.default)(_fsExtra2.default.readFileSync(_path2.default.join(file.dir, file.base)).toString());

    var attributes = _fm.attributes;
    var body = _fm.body;

    file.content = attributes;
    file.content.content = (0, _marked2.default)(body);

    return file;
  }

  function addContent(file) {
    var name = file.name;
    var namespace = file.namespace;
    var content = file.content;

    if (!(0, _has2.default)(data, namespace)) {
      (0, _set2.default)(data, namespace, new Map());
    }

    (0, _set2.default)(data, [namespace, name].join('.'), content);
  }

  // Try to load the settings file.
  if ((0, _fileExists2.default)(settingsPath)) {
    data = _jsYaml2.default.safeLoad(_fsExtra2.default.readFileSync(settingsPath, 'utf8'));
  }

  // Try to load content data.
  if (_pathExists2.default.sync(contentPath)) {
    _fsFinder2.default.from(contentPath).findFiles('*.md').map(_path2.default.parse).map(namespaceFromFile).map(parseContent).forEach(addContent);
  }

  return data;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _frontMatter = require('front-matter');

var _frontMatter2 = _interopRequireDefault(_frontMatter);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _fsFinder = require('fs-finder');

var _fsFinder2 = _interopRequireDefault(_fsFinder);

var _fileExists = require('file-exists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _has = require('lodash/has');

var _has2 = _interopRequireDefault(_has);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }