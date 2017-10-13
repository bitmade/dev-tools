/**
 * Copyright (c) 2016-present, Bitmade
 *
 * @author Manuel Moritz-Schliesing <manuel@bitmade.de>
 */

process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const clearConsole = require('clear');
const fileExists = require('file-exists');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const noop = require('noop-fn');
const _ = require('lodash');
const bs = require('browser-sync').create();
const twig = require('../utils/twig');
const config = require('../utils/config');
const REASONS = {
  CSS: 'css',
  JS: 'js',
  UNKNOWN: 'unknown',
};

let compiler;
let lastTimestamps;

if (!argv.mode) {
  console.log(
    chalk.red('You must specify the --mode option using "stream" or "write".')
  );
  console.log();
  process.exit(0);
}

setupBrowserSync();
setupCompiler();
setupApp(argv.mode);

function setupBrowserSync() {
  bs.init({
    host: 'localhost',
    logLevel: 'silent',
    port: 3000,
    proxy: 'http://localhost:3010/',
    open: false,
    files: [path.resolve('twig', '**', '*.twig')],
  });
}

function setupCompiler() {
  compiler = webpack(config);

  compiler.plugin('invalid', () => {
    clearConsole();
    console.log('Compiling...');
  });

  compiler.plugin('done', stats => {
    clearConsole();

    lastTimestamps = triggerReload(stats, lastTimestamps);

    const messages = stats.toJson({}, true);

    if (!stats.hasErrors() && !stats.hasWarnings()) {
      console.log(chalk.green('Compiled successfully!'));
      console.log();
      console.log('The app is running at:');
      console.log();
      console.log('  ' + chalk.cyan('http://localhost:3000/'));
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log(
        'To create a production build, use ' + chalk.cyan('npm run build') + '.'
      );
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
}

function setupApp(mode) {
  const app = express();

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
      app.use(
        webpackDevMiddleware(compiler, {
          publicPath: config.output.publicPath,
          quiet: true,
        })
      );
      break;
    case 'write':
      // Invoke the compiler with no options and a fake callback.
      compiler.watch({}, noop);
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
  app.use(
    express.static('public', {
      index: false,
      redirect: false,
    })
  );

  // Catch all requests because we don't request the template files directly but
  // with a route-like architecture.
  app.get('*', (req, res, next) => {
    // Get the requested path without the leading slash.
    const route = req.params[0].substr(1);
    // If the path is empty we need the index page.
    const template = route === '' ? 'index' : route;

    // Check if the requested template exists in the filesystem and render it
    // if it does. Invoke the next listener on the app stack otherwise.
    fileExists.sync(path.join(process.cwd(), 'twig', template + '.twig'))
      ? res.render(template)
      : next();
  });

  // Listen on port 3010 so that BrowserSync can listen on port 3000 and proxy
  // this server to inject the scripts needed for BrowserSync to run.
  app.listen(3010);
}

function triggerReload(stats, lastTimestamps) {
  // Get the current compilation.
  const compilation = stats.compilation;
  // Get all timestamps from all related files.
  const currentTimestamps = compilation.compiler.fileTimestamps;
  const files = Object.keys(currentTimestamps);
  let reason = REASONS.UNKNOWN;

  // We only care about getting the changed file on subsequent runs when data about
  // previous compilations is available.
  if (lastTimestamps) {
    // Get all files that are either new or have a higher timestamp since the last compilation.
    const changed = files.filter(file => {
      // If the file doesn't exist in the list it is new and therefore changed.
      if (!lastTimestamps[file]) {
        return true;
      }

      // If the current timestamp is greater then the previous, the file was changed.
      return currentTimestamps[file] > lastTimestamps[file];
    });

    // Get the extensions to allow batched updates of the same file type.
    const extensions = _.uniq(
      changed.map(file => path.parse(file).ext.substr(1))
    );

    if (extensions.length === 1) {
      switch (extensions.pop()) {
        case 'scss':
        case 'sass':
        case 'css':
          reason = REASONS.CSS;
          break;
        case 'js':
        case 'jsx':
          reason = REASONS.JS;
          break;
        default:
          reason = REASONS.UNKNOWN;
      }
    }
  }

  switch (reason) {
    case REASONS.CSS:
      bs.reload('*.css');
      break;
    default:
      bs.reload();
  }

  return currentTimestamps;
}
