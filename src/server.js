import path from 'path';
import fileExists from 'file-exists';
import express from 'express';
import handlebars  from 'express-handlebars';
import discoverData from './discoverData';

export default (options, middlewares = []) => {

  const app = express(),
    context = discoverData(options);

  middlewares.forEach(middleware => app.use(middleware));

  app.use(express.static(options.express.staticPath, { index: false }));

  // Get the raw extension without the dot.
  const rawExtname = options.handlebars.extname.substr(1);

  app.engine(rawExtname, handlebars(options.handlebars));
  app.set('view engine', rawExtname);
  app.set('views', options.express.viewsPath);

  app.get('*', (req, res) => {

    const view = req.params[0].substr(1),
      viewExists = fileExists(path.join(options.context, options.express.viewsPath, `${view}.${rawExtname}`));

    res.render(viewExists ? view : 'index', context);
  });

  return app;
}