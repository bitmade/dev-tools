#! /usr/bin/env node

var path = require('path');
var program = require('commander');
var createServer = require('../index').createServer;

program
  .version('0.0.1')
  .option('--webpack-config <file>', 'Path to wWebpack configuration file')
  .option('--build-assets', 'Set to true if assets should be written to the filesystem.')
  .parse(process.argv);

var options = {
  context: process.cwd(),
  buildAssets: program.buildAssets
};

if (program.webpackConfig) {
  options.webpack = {
    config: path.resolve(program.webpackConfig),
  }
}

var server = createServer(options);

server.listen(3010);