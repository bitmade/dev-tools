/**
 * Copyright (c) 2016-present, Bitmade
 *
 * @author Manuel Moritz-Schliesing <manuel@bitmade.de>
 */

process.env.NODE_ENV = 'production';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
require('dotenv').config({ silent: true });

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const noop = require('noop-fn');
const clearConsole = require('clear');
const webpack = require('webpack');
const Finder = require('fs-finder');
const fs = require('fs-extra');
const config = require('../utils/config');
const twig = require('../utils/twig');

// Load the default webpack.config.js from the dev-tools directory or the project directory.
const templatePath = path.join(process.cwd(), 'twig');

clearConsole();
console.log();

// Compile JS and CSS assets if any of the two options is given. At the moment there is no
// possibility and also no need to compile them separately.
if (argv.js || argv.css) {
  runCompiler();
}

if (argv.html) {
  Finder.from(templatePath)
    .exclude([
      path.join(process.cwd(), 'twig', 'partials'),
      path.join(process.cwd(), 'twig', 'layouts'),
    ])
    .findFiles('.twig')
    .map(buildTemplateInfo)
    .forEach(renderTemplate);

  console.log(chalk.green('Templates have been compiled successfully!'));
  console.log();
}

function runCompiler() {
  const compiler = webpack(config);

  compiler.plugin('done', stats => {
    const messages = stats.toJson({}, true);

    if (!stats.hasErrors()) {
      console.log(chalk.green('Assets have been compiled successfully!'));
      console.log();
    }

    if (stats.hasErrors()) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (stats.hasWarnings()) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
    }
  });

  compiler.run(noop);
}

function buildTemplateInfo(original) {
  const file = path.parse(path.relative(templatePath, original));

  // If the filename is not index, append the name to file.dir
  const dir = file.name != 'index' ? path.join(file.dir, file.name) : file.dir;

  return {
    original: original,
    dir: path.join(process.cwd(), 'public', dir),
    name: 'index.html',
  };
}

function renderTemplate(file) {
  twig(file.original, {}, (err, template) => {
    fs.ensureDir(file.dir, () => {
      fs.writeFile(path.join(file.dir, file.name), template);
    });
  });
}
