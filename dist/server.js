'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fileExists = require('file-exists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _discoverData = require('./discoverData');

var _discoverData2 = _interopRequireDefault(_discoverData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (options) {
  var middlewares = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var app = (0, _express2.default)(),
      context = (0, _discoverData2.default)(options);

  middlewares.forEach(function (middleware) {
    return app.use(middleware);
  });

  app.use(_express2.default.static(options.express.staticPath, { index: false }));

  // Get the raw extension without the dot.
  var rawExtname = options.handlebars.extname.substr(1);

  app.engine(rawExtname, (0, _expressHandlebars2.default)(options.handlebars));
  app.set('view engine', rawExtname);
  app.set('views', options.express.viewsPath);

  app.get('*', function (req, res) {

    var view = req.params[0].substr(1),
        viewExists = (0, _fileExists2.default)(_path2.default.join(options.context, options.express.viewsPath, view + '.' + rawExtname));

    res.render(viewExists ? view : 'index', context);
  });

  return app;
};