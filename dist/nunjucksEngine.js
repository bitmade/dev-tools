'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (path) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  _nunjucks2.default.configure(path, Object.assign({}, {
    throwOnUndefined: true,
    trimBlocks: true,
    lstripBlocks: true,
    noCache: true,
    tags: {}
  }, opts));

  return _nunjucks2.default;
};