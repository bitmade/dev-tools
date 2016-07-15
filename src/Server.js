import path from 'path';
import fileExists from 'file-exists';
import express from 'express';
import DataDiscoverer from './DataDiscoverer';
import twigEngine from './twigEngine';

export default class Server {

  constructor(context, options = {}) {
    this.context = context;
    this.options = Object.assign({}, {
      settingsFile: 'site.yml',
      contentPath: 'content',
      publicPath: 'public',
      viewExtension: '.twig',
      viewsPath: 'twig'
    }, options);

    this.app = express();
    this.discoverer = new DataDiscoverer(this.context, this.options.settingsFile, this.options.contentPath);
    this.data = {};
    this.middlewares = [];
    this.initialized = false;
  }

  setup() {

    this.loadData();

    const { app, options, context, data } = this;

    this.middlewares.forEach(middleware => app.use(middleware));

    app.use(express.static(options.publicPath, {
      index: false,
      redirect: false
    }));

    // Get the raw extension without the dot.
    const rawExtname = options.viewExtension.substr(1);

    app.set('view engine', rawExtname);
    app.set('views', options.viewsPath);

    app.engine(options.viewExtension, twigEngine(path.resolve(options.viewsPath)));

    app.get('*', (req, res) => {
      const view = req.params[0].substr(1),
        viewExists = fileExists(path.join(context, options.viewsPath, `${view}.${rawExtname}`));

      res.render(viewExists ? view : 'index', data);
    });

    this.initialized = true;
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  loadData() {
    this.data = this.discoverer.load();
  }

  listen(port) {

    if (!this.initialized) {
      this.setup();
    }

    this.app.listen(port);
  }
}
