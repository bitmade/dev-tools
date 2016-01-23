'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDevelopment = isDevelopment;
exports.isProduction = isProduction;
exports.getEnvironment = getEnvironment;
var environment = process.env.NODE_ENV == 'production' ? 'production' : 'development';

function isDevelopment() {
  return environment == 'development';
}

function isProduction() {
  return !isDevelopment();
}

function getEnvironment() {
  return environment;
}