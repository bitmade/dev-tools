import twig from 'node-twig';

export default (path, opts = {}) => (
  twig.createEngine(Object.assign({}, {
    root: path,
    aliases: {
      twig: path,
    },
  }, opts))
);
