import nunjucks from 'nunjucks';

export default (path, opts = {}) => {
  nunjucks.configure(path, Object.assign({}, {
    throwOnUndefined: true,
    trimBlocks: true,
    lstripBlocks: true,
    noCache: true,
    tags: {},
  }, opts));

  return nunjucks;
};