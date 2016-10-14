/**
 * Copyright (c) 2016-present, Bitmade
 *
 * @author Manuel Moritz-Schliesing <manuel@bitmade.de>
 */

process.env.NODE_ENV = 'development';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
require('dotenv').config({ silent: true });

var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var clearConsole = require('clear');
var fileExists = require('file-exists');
var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var twig = require('../utils/twig');
var config = require('../utils/config');
var compiler;

if (!argv.mode) {
  console.log(chalk.red('You must specify the --mode option using "stream" or "write".'));
  console.log();
  process.exit(0);
}

setupCompiler();
setupApp(argv.mode);

function setupCompiler() {
  compiler = webpack(config);

  compiler.plugin('invalid', function() {
    clearConsole();
    console.log('Compiling...');
  });

  compiler.plugin('done', function (stats) {
    clearConsole();

    var messages = stats.toJson({}, true);

    if (!stats.hasErrors() && !stats.hasWarnings()) {
      console.log(chalk.green('Compiled successfully!'));
      console.log();
      console.log('The app is running at:');
      console.log();
      console.log('  ' + chalk.cyan('http://localhost:3000/'));
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log('To create a production build, use ' + chalk.cyan('npm run build') + '.');
      console.log();
    }

    if (stats.hasErrors()) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach(function (message) {
        console.log(message);
        console.log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (stats.hasWarnings()) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach(function (message) {
        console.log(message);
        console.log();
      });
    }
  });
}

function setupApp(mode) {
  var app = express();

  // Configure the view engine. We use node-twig here to get the full power of the "real",
  // native Twig PHP library.
  app.set('view engine', 'twig');
  app.set('views', 'twig');
  app.engine('twig', twig);

  // The server can compile in two modes: "stream" or "write".
  //
  // "stream": The "stream" option compiles JS and CSS assets to memory and serves them
  //           on a virtual path. This is handled by the webpack-dev-middleware package.
  //           by default the public path - defined in webpack.config.js - is /build/.
  //           The compiled JS file will therefore be served on /build/bundle.js.
  // "write":  The "write" mode compiles the same files as the "stream" mode but writes
  //           the contents to disk. The express server is configured so that these files
  //           will also be accessible at /build/bundle.js or /build/screen.css. The only
  //           difference in this scenario is that the files are actually read from disk.
  switch (mode) {
    case 'stream':
      // Build temporary assets using the Webpack dev middleware.
      app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        quiet: true,
      }));
      break;
    case 'write':
      // Invoke the compiler with no options and a fake callback.
      compiler.watch({}, function () {});
      break;
    default:
      console.log(chalk.red('The given type "' + mode + '" was not found.'));
  }

  // Serve static files from the public folder. To retrieve a file inside this directory
  // just call it on the root level like so: /image.jpg. Subfolders can be created too.
  // In fact we are doing this when compiling assets to disk. They are written to ./public/build
  // and may then be accessed by calling /build/bundle.js.
  // We do also disable any automation like adding trailing slashes or resolving index files because
  // this might interfere with our template handling.
  app.use(express.static('public', {
    index: false,
    redirect: false
  }));

  // Catch all requests because we don't request the template files directly but
  // with a route-like architecture.
  app.get('*', function (req, res, next) {
    // Get the requested path without the leading slash.
    var route = req.params[0].substr(1);
    // If the path is empty we need the index page.
    var template = route === '' ? 'index' : route;

    // Check if the requested template exists in the filesystem and render it
    // if it does. Invoke the next listener on the app stack otherwise.
    fileExists(path.join(process.cwd(), 'twig', template + '.twig'))
      ? res.render(template)
      : next();
  });

  // Listen on port 3010 so that BrowserSync can listen on port 3000 and proxy
  // this server to inject the scripts needed for BrowserSync to run.
  app.listen(3010);
}
