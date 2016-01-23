import WebpackConfig from 'webpack-config';
import Renderer from './Renderer';
import Compiler from './Compiler';

export default class Exporter {

  constructor(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath, defaultLayout, webpackConfig) {
    this.compiler = new Compiler(new WebpackConfig().extend(webpackConfig));
    this.renderer = new Renderer(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath, defaultLayout);
  }

  run() {
    this.compiler.run();
    this.renderer.run();
  }
}