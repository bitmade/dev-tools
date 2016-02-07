'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _templatesHelpers = require('./templatesHelpers');

var _templatesHelpers2 = _interopRequireDefault(_templatesHelpers);

var _DataDiscoverer = require('./DataDiscoverer');

var _DataDiscoverer2 = _interopRequireDefault(_DataDiscoverer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Server);

    this.context = context;
    this.options = Object.assign({}, {
      settingsFile: 'site.yml',
      contentPath: 'content',
      publicPath: 'public',
      viewExtension: '.hbs',
      defaultLayout: 'base',
      viewsPath: 'views'
    }, options);

    this.app = (0, _express2.default)();
    this.discoverer = new _DataDiscoverer2.default(this.context, this.options.settingsFile, this.options.contentPath);
    this.data = {};
    this.middlewares = [];
    this.initialized = false;
  }

  _createClass(Server, [{
    key: 'setup',
    value: function setup() {

      this.loadData();

      var app = this.app;
      var options = this.options;
      var context = this.context;
      var data = this.data;

      this.middlewares.forEach(function (middleware) {
        return app.use(middleware);
      });

      app.use(_express2.default.static(options.publicPath, { index: false }));

      // Get the raw extension without the dot.
      var rawExtname = options.viewExtension.substr(1);

      app.engine(rawExtname, (0, _expressHandlebars2.default)({
        helpers: _templatesHelpers2.default,
        extname: options.viewExtension,
        defaultLayout: options.defaultLayout
      }));
      app.set('view engine', rawExtname);
      app.set('views', options.viewsPath);

      app.get('*', function (req, res) {
        var view = req.params[0].substr(1),
            viewExists = (0, _fileExists2.default)(_path2.default.join(context, options.viewsPath, view + '.' + rawExtname));

        res.render(viewExists ? view : 'index', data);
      });

      this.initialized = true;
    }
  }, {
    key: 'use',
    value: function use(middleware) {
      this.middlewares.push(middleware);
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      this.data = this.discoverer.load();
    }
  }, {
    key: 'listen',
    value: function listen(port) {

      if (!this.initialized) {
        this.setup();
      }

      this.app.listen(port);
    }
  }]);

  return Server;
}();

exports.default = Server;