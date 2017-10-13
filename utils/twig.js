const twig = require('node-twig');
const path = require('path');

const templatePath = path.join(process.cwd(), 'twig');

const engine = twig.createEngine({
  root: templatePath,
  aliases: {
    twig: templatePath,
  },
});

module.exports = engine;
