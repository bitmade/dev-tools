'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _defaultOptions = require('./defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _browserSyncWebpackPlugin = require('browser-sync-webpack-plugin');

var _browserSyncWebpackPlugin2 = _interopRequireDefault(_browserSyncWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _postcssAssets = require('postcss-assets');

var _postcssAssets2 = _interopRequireDefault(_postcssAssets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = require.resolve('style-loader');
var raw = require.resolve('raw-loader');
var sass = require.resolve('sass-loader');
var postcss = require.resolve('postcss-loader');
var babel = require.resolve('babel-loader');
var presetReact = require.resolve('babel-preset-react');
var presetES2015 = require.resolve('babel-preset-es2015');

function getPlugins(options) {
  var env = options.env;
  var context = options.context;

  var GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env == 'development'
  };

  var plugins = [new _extractTextWebpackPlugin2.default('screen.css'), new _webpack2.default.optimize.OccurenceOrderPlugin(), new _webpack2.default.DefinePlugin(GLOBALS) //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
  ];

  switch (env) {
    case 'production':
      plugins.push(new _webpack2.default.optimize.DedupePlugin());
      plugins.push(new _webpack2.default.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false }));
      break;
    case 'development':
      plugins.push(new _webpack2.default.NoErrorsPlugin());
      plugins.push(new _browserSyncWebpackPlugin2.default({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:3010/',
        open: false,
        files: [_path2.default.join(context, options.express.viewsPath, '**', '*' + options.handlebars.extname)]
      }));
      break;
  }

  return plugins;
}

exports.default = function (options) {

  options = (0, _defaultOptions2.default)(options);

  var _options = options;
  var env = _options.env;
  var context = _options.context;

  return {
    debug: env == 'development',
    devtool: env == 'production' ? false : 'eval-source-map', //more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    entry: _path2.default.join(context, 'js', 'main.js'),
    output: {
      path: _path2.default.join(context, 'public', 'build'),
      publicPath: '/build/',
      filename: 'bundle.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: babel,
        query: {
          presets: [presetReact, presetES2015]
        }
      }, {
        test: /(\.css|\.scss)$/,
        include: _path2.default.join(context, 'sass'),
        loader: _extractTextWebpackPlugin2.default.extract(style, [raw, postcss, sass].join('!'))
      }]
    },
    postcss: function postcss() {
      return [_autoprefixer2.default, (0, _postcssAssets2.default)({
        loadPaths: ['images/'],
        basePath: 'public/'
      })];
    },
    plugins: getPlugins(options)
  };
};