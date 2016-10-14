var environment = process.env.NODE_ENV == 'production' ? 'production' : 'development';

exports.isDevelopment = function () {
  return environment == 'development';
};

exports.isProduction = function () {
  return environment == 'production';
};

exports.getEnvironment = function () {
  return environment;
};
