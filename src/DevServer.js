import WebpackConfig from 'webpack-config';
import Server from './Server';
import Compiler from './Compiler';

export default class DevServer {

  constructor(context, webpackConfig, buildAssets = false) {
    this.context = context;
    this.webpackConfig = webpackConfig;
    this.buildAssets = buildAssets;

    this.compiler = new Compiler(new WebpackConfig().extend(this.webpackConfig));
    this.server = new Server(this.context);

    // Build temporary assets using the Webpack dev middleware.
    this.buildAssets ? this.compiler.watch() : this.server.use(this.compiler.middleware());
  }

  listen(port) {
    this.server.listen(port);
  }
}
