const path = require('path');
const env = require('./utils/environment');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  devtool: env.isProduction() ? false : 'cheap-module-eval-source-map',
  entry: path.resolve('js', 'main.js'),
  output: {
    path: path.resolve('public', 'build'),
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('babel-preset-env')],
          }
        },
      },
      {
        test: /(\.css|\.scss)$/,
        include: path.resolve('sass'),
        use: ExtractTextPlugin.extract({
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap: env.isDevelopment(),
                minimize: env.isProduction(),
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                config: {
                  path: __dirname + '/postcss.config.js'
                },
                sourceMap: env.isDevelopment() ? 'inline' : false,
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: { sourceMap: env.isDevelopment() },
            },
          ],
        }),
      }
    ],
  },
  plugins: getPlugins()
};

function getPlugins () {

  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env.getEnvironment()),
    __DEV__: env.isDevelopment()
  };

  const plugins = [
    new ExtractTextPlugin('screen.css'),
    new webpack.DefinePlugin(GLOBALS),
  ];

  switch(env.getEnvironment()) {
    case 'production':
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: false
      }));
      break;
    case 'development':
      plugins.push(new webpack.NoEmitOnErrorsPlugin());
      break;
  }

  return plugins;
}

module.exports = config;
