import WebpackConfig from 'webpack-config';
import Renderer from './Renderer';
import Compiler from './Compiler';

export default class Exporter {

  constructor(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath, webpackConfig) {
    this.compiler = new Compiler(new WebpackConfig().extend(webpackConfig));
    this.renderer = new Renderer(context, viewsPath, settingsFile, contentDir, viewsExtension, publicPath);
  }

  runAssetCompiler() {
    this.compiler.run();
  }

  runTemplateRenderer() {
    this.renderer.run();
  }

  runAll() {
    this.runAssetCompiler();
    this.runTemplateRenderer();
  }
}