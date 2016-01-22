import path from 'path';
import defaultsDeep from 'lodash/defaultsDeep';

export default (options = {}) => {
  return defaultsDeep(options, {
    context: __dirname,
    env: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    buildAssets: false,
    settingsFile: 'site.yml',
    contentDir: 'content',
    handlebars: {
      extname: '.hbs',
      defaultLayout: 'base'
    },
    express: {
      staticPath: 'public',
      viewsPath: 'views'
    },
    webpack: {
      config: path.join(__dirname, 'createConfig.js')
    },
    webpackDevMiddleware: {
      publicPath: '/build/',
      stats: {
        colors: true,
        children: false,
        chunks: false,
        version: false,
        hash: false
      }
    }
  });
}