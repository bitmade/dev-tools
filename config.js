var path = require('path');
var WebpackConfig = require('webpack-config');
var env = require('./dist/environment');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var assets = require('postcss-assets');
var style = require.resolve('style-loader');
var raw = require.resolve('raw-loader');
var sass = require.resolve('sass-loader');
var postcss = require.resolve('postcss-loader');
var babel = require.resolve('babel-loader');
var presetReact = require.resolve('babel-preset-react');
var presetES2015 = require.resolve('babel-preset-es2015');

module.exports = new WebpackConfig().merge({
  debug: env.isDevelopment(),
  devtool: env.isProduction() ? false : 'eval-source-map', //more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  entry: path.resolve('js', 'main.js'),
  output: {
    path: path.resolve('public', 'build'),
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: babel,
        query: {
          presets: [presetReact, presetES2015]
        }
      },
      {
        test: /(\.css|\.scss)$/,
        include: path.resolve('sass'),
        loader: ExtractTextPlugin.extract(style, [raw, postcss, sass].join('!'))
      }
    ]
  },
  postcss: function () {
    return [
      autoprefixer,
      assets({
        loadPaths: ['images/'],
        basePath: 'public/'
      })
    ];
  },
  plugins: getPlugins()
});

function getPlugins () {

  var GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env.getEnvironment()),
    __DEV__: env.isDevelopment()
  };

  var plugins = [
    new ExtractTextPlugin('screen.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS) //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
  ];

  switch(env.getEnvironment()) {
    case 'production':
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: false
      }));
      break;
    case 'development':
      plugins.push(new webpack.NoErrorsPlugin());
      plugins.push(new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:3010/',
        open: false,
        files: [path.resolve('views', '**', '*.twig')]
      }));
      break;
  }

  return plugins;
}