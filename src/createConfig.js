import path from 'path';
import defaultOptions from './defaultOptions';
import webpack from 'webpack';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import assets from 'postcss-assets';

const style = require.resolve('style-loader');
const raw = require.resolve('raw-loader');
const sass = require.resolve('sass-loader');
const postcss = require.resolve('postcss-loader');
const babel = require.resolve('babel-loader');
const presetReact = require.resolve('babel-preset-react');
const presetES2015 = require.resolve('babel-preset-es2015');

function getPlugins (options) {

  const { env, context } = options;

  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env == 'development'
  };

  let plugins = [
    new ExtractTextPlugin('screen.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS) //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
  ];

  switch(env) {
    case 'production':
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false }));
      break;
    case 'development':
      plugins.push(new webpack.NoErrorsPlugin());
      plugins.push(new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:3010/',
        open: false,
        files: [path.join(context, options.express.viewsPath, '**', '*' + options.handlebars.extname)]
      }));
      break;
  }

  return plugins;
}

export default (options) => {

  options = defaultOptions(options);

  const { env, context } = options;

  return {
    debug: env == 'development',
    devtool: env == 'production' ? false : 'eval-source-map', //more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    entry: path.join(context, 'js', 'main.js'),
    output: {
      path: path.join(context, 'public', 'build'),
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
          include: path.join(context, 'sass'),
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
    plugins: getPlugins(options)
  }
}