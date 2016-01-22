import path from 'path';
import yaml from 'js-yaml';
import fm from 'front-matter';
import marked from 'marked';
import Finder from 'fs-finder';
import fileExists from 'file-exists';
import pathExists from 'path-exists';
import fs from 'fs-extra';
import setDeep from 'lodash/set';
import getDeep from 'lodash/get';
import hasDeep from 'lodash/has';

export default function (options) {

  let data = {};

  const settingsPath = path.join(options.context, options.settingsFile),
    contentPath = path.join(options.context, options.contentDir);

  function namespaceFromFile(file) {
    file.namespace = path.relative(options.context, file.dir).replace(/\//, '.');
    return file;
  }

  function parseContent(file) {
    const { attributes, body} = fm(fs.readFileSync(path.join(file.dir, file.base)).toString());

    file.content = attributes;
    file.content.content = marked(body);

    return file;
  }

  function addContent(file) {
    const { name, namespace, content } = file;

    if (!hasDeep(data, namespace)) {
      setDeep(data, namespace, new Map());
    }

    setDeep(data, [namespace, name].join('.'), content);
  }

  // Try to load the settings file.
  if (fileExists(settingsPath)) {
    data = yaml.safeLoad(fs.readFileSync(settingsPath, 'utf8'));
  }

  // Try to load content data.
  if (pathExists.sync(contentPath)) {
    Finder
      .from(contentPath)
      .findFiles('*.md')
      .map(path.parse)
      .map(namespaceFromFile)
      .map(parseContent)
      .forEach(addContent);
  }

  return data;
}