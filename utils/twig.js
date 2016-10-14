var twig = require('node-twig');
var path = require('path');

var templatePath = path.join(process.cwd(), 'twig');

var engine = twig.createEngine({
  root: templatePath,
  aliases: {
    twig: templatePath,
  },
});

module.exports = engine;
