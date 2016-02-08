import path from 'path';
import hbs from './hbsEngine';
import Finder from 'fs-finder';
import fs from 'fs-extra';
import DataDiscoverer from './DataDiscoverer';

export default class Renderer {

  constructor(context, viewsPath, settingsFile, contentDir, viewExtension, publicPath, defaultLayout) {
    this.context = context;
    this.hbs = hbs(context, { defaultLayout, viewExtension, viewsPath });
    this.viewsPath = path.join(context, viewsPath);
    this.layoutsDir = path.relative(viewsPath, this.hbs.layoutsDir);
    this.partialsDir = path.relative(viewsPath, this.hbs.partialsDir);
    this.viewExtension = viewExtension;
    this.publicPath = publicPath;
    this.data = new DataDiscoverer(context, settingsFile, contentDir).load();
  }

  run() {
    Finder
      .from(this.viewsPath)
      .exclude([this.layoutsDir, this.partialsDir])
      .findFiles(this.viewExtension)
      .map(this.buildTemplateInfo.bind(this))
      .forEach(this.renderTemplate.bind(this));
  }

  buildTemplateInfo(original) {

    const file = path.parse(path.relative(this.viewsPath, original));

    // If the filename is not index, append the name to file.dir
    const dir = file.name != 'index' ? path.join(file.dir, file.name) : file.dir;

    return {
      original,
      dir: path.join(this.context, this.publicPath, dir),
      name: 'index.html'
    }
  }

  renderTemplate(file) {
    this.hbs.renderView(file.original, this.data, (err, template) => {
      fs.ensureDir(file.dir, () => {
        fs.writeFile(path.join(file.dir, file.name), template)
      });
    });
  }
}