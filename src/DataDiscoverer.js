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

export default class DataDiscoverer {

  constructor(context, settingsFile, contentDir) {
    this.context = context;
    this.settingsPath = path.join(context, settingsFile);
    this.contentPath = path.join(context, contentDir);
    this.data = {};
  }

  namespaceFromFile(file) {
    file.namespace = path.relative(this.context, file.dir).replace(/\//, '.');
    return file;
  }

  parseContent(file) {
    const { attributes, body} = fm(fs.readFileSync(path.join(file.dir, file.base)).toString());

    file.content = attributes;
    file.content.content = marked(body);

    return file;
  }

  addContent(file) {
    const { name, namespace, content } = file;

    if (!hasDeep(this.data, namespace)) {
      setDeep(this.data, namespace, new Map());
    }

    setDeep(this.data, [namespace, name].join('.'), content);
  }

  load() {
    this.data = {};

    // Try to load the settings file.
    if (fileExists(this.settingsPath)) {
      this.data = yaml.safeLoad(fs.readFileSync(this.settingsPath, 'utf8'));
    }

    // Try to load content data.
    if (pathExists.sync(this.contentPath)) {
      Finder
        .from(this.contentPath)
        .findFiles('*.md')
        .map(path.parse)
        .map(this.namespaceFromFile.bind(this))
        .map(this.parseContent.bind(this))
        .forEach(this.addContent.bind(this));
    }

    return this.data;
  }
}