'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeTwig = require('node-twig');

var _nodeTwig2 = _interopRequireDefault(_nodeTwig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (path) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  return _nodeTwig2.default.createEngine(Object.assign({}, {
    root: path,
    aliases: {
      twig: path
    }
  }, opts));
};