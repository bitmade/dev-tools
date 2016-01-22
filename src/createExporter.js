import defaultOptions from './defaultOptions';
import hbsRenderer from './hbsRenderer';
import getWebpack from './webpack';

export default function (options) {

  options = defaultOptions(options);

  return {
    run: () => {
      var compiler = getWebpack(options);
      compiler.run((err, stats) => console.log(stats.toString({ colors: true })));
      hbsRenderer(options);
    }
  };
}