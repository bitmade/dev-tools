import path from 'path';
import handlebars  from 'express-handlebars';
import Finder from 'fs-finder';
import fs from 'fs-extra';
import discoverData from './discoverData';

export default (options) => {

  const hbs = new handlebars.ExpressHandlebars(options.handlebars),
    viewsPath = path.join(options.context, options.express.viewsPath),
    layoutsDir = path.relative(options.express.viewsPath, hbs.layoutsDir),
    partialsDir = path.relative(options.express.viewsPath, hbs.partialsDir),
    context = discoverData(options);

  Finder
    .from(viewsPath)
    .exclude([layoutsDir, partialsDir])
    .findFiles(options.handlebars.extname)
    .map(buildTemplateInfo)
    .forEach(renderTemplate);

  function buildTemplateInfo(original) {

    const file = path.parse(path.relative(viewsPath, original));

    // If the filename is not index, append the name to file.dir
    const dir = file.name != 'index' ? path.join(file.dir, file.name) : file.dir;

    return {
      original,
      dir: path.join(options.context, options.express.staticPath, dir),
      name: 'index.html'
    }
  }

  function renderTemplate(file) {
    hbs.renderView(file.original, context, (err, template) => {
      fs.ensureDir(file.dir, () => {
        fs.writeFile(path.join(file.dir, file.name), template)
      });
    });
  }
}