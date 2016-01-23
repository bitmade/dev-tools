#! /usr/bin/env node
var path = require('path');
var program = require('commander');
var Exporter = require('../index').Exporter;

program
  .version('0.0.1')
  .parse(process.argv);

new Exporter(
  process.cwd(),
  'views',
  'site.yml',
  'content',
  '.hbs',
  'public',
  'base',
  path.join(process.cwd(), 'webpack.config.js')
).run();