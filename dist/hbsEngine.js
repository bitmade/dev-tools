'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (context, options) {
  var hbs = _expressHandlebars2.default.create({
    helpers: _templatesHelpers2.default,
    extname: options.viewExtension,
    defaultLayout: options.defaultLayout
  });

  var handlebars = hbs.handlebars;

  (0, _handlebarsRegistrar2.default)(handlebars, {
    helpers: _path2.default.resolve(context, 'views', 'helpers', '**', '*.{hbs,js}'),
    partials: [_path2.default.resolve(context, options.viewsPath, 'partials', '**', '*.{hbs,js}'), _path2.default.resolve(context, options.viewsPath, 'layouts', '**', '*.{hbs,js}')]
  });

  handlebars.registerHelper((0, _handlebarsLayouts2.default)(handlebars));

  return hbs;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _handlebarsLayouts = require('handlebars-layouts');

var _handlebarsLayouts2 = _interopRequireDefault(_handlebarsLayouts);

var _handlebarsRegistrar = require('handlebars-registrar');

var _handlebarsRegistrar2 = _interopRequireDefault(_handlebarsRegistrar);

var _templatesHelpers = require('./templatesHelpers');

var _templatesHelpers2 = _interopRequireDefault(_templatesHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }