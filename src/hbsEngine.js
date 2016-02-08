import path from 'path';
import exphbs from 'express-handlebars';
import layouts from 'handlebars-layouts';
import registrar from 'handlebars-registrar';
import helpers from './templatesHelpers';

export default function (context, options) {
  const hbs = exphbs.create({
    helpers,
    extname: options.viewExtension,
    defaultLayout: options.defaultLayout,
  });

  const handlebars = hbs.handlebars;

  registrar(handlebars, {
    helpers: path.resolve(context, 'views', 'helpers', '**', '*.{hbs,js}'),
    partials: [
      path.resolve(context, options.viewsPath, 'partials', '**', '*.{hbs,js}'),
      path.resolve(context, options.viewsPath, 'layouts', '**', '*.{hbs,js}'),
    ]
  });

  handlebars.registerHelper(layouts(handlebars));

  return hbs;
}