'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _defaultsDeep2.default)(options, {
    context: __dirname,
    env: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    buildAssets: false,
    settingsFile: 'site.yml',
    contentDir: 'content',
    handlebars: {
      extname: '.hbs',
      defaultLayout: 'base'
    },
    express: {
      staticPath: 'public',
      viewsPath: 'views'
    },
    webpack: {
      config: _path2.default.join(__dirname, 'createConfig.js')
    },
    webpackDevMiddleware: {
      publicPath: '/build/',
      stats: {
        colors: true,
        children: false,
        chunks: false,
        version: false,
        hash: false
      }
    }
  });
};