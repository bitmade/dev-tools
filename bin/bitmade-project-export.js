#! /usr/bin/env node

var program = require('commander');
var createExporter = require('../index').createExporter;

program
  .version('0.0.1')
  .parse(process.argv);

var exporter = createExporter({
  context: process.cwd()
});

exporter.run();