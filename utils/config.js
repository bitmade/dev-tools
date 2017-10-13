const path = require('path');
const fileExists = require('file-exists');

// Load the default webpack.config.js from the dev-tools directory or the project directory.
const customConfigPath = path.join(process.cwd(), 'webpack.config.js');
const config = require(fileExists.sync(customConfigPath)
  ? customConfigPath
  : '../webpack.config.js');

module.exports = config;
