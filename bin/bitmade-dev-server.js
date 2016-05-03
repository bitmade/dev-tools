#! /usr/bin/env node
var path = require('path');
var program = require('commander');
var DevServer = require('../index').DevServer;

program
  .version('2.0.0')
  .option('--context <file>', 'This is process.cwd() when called from the root dir.')
  .option('--webpack-config <file>', 'Path to Webpack configuration file')
  .option('--build-assets', 'Set to true if assets should be written to the filesystem.')
  .parse(process.argv);

var context = program.context
  ? program.context
  : process.cwd();

var webpackConfig = program.webpackConfig
  ? path.resolve(program.webpackConfig)
  : path.join(context, 'webpack.config.js');

new DevServer(context, webpackConfig, program.buildAssets).listen(3010);