var path = require('path');
var fileExists = require('file-exists');

// Load the default webpack.config.js from the dev-tools directory or the project directory.
var customConfigPath = path.join(process.cwd(), 'webpack.config.js');
var config = require(fileExists(customConfigPath) ? customConfigPath : '../webpack.config.js');

module.exports = config;
