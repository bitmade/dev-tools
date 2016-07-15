#! /usr/bin/env node
var path = require('path');
var program = require('commander');
var Exporter = require('../index').Exporter;

program
  .version('2.0.0')
  .option('--compile-assets')
  .option('--compile-templates')
  .parse(process.argv);

var exporter = new Exporter(
  process.cwd(),
  'twig',
  'site.yml',
  'content',
  '.twig',
  'public',
  path.join(process.cwd(), 'webpack.config.js')
);

program.compileAssets && exporter.runAssetCompiler();
program.compileTemplates && exporter.runTemplateRenderer();
