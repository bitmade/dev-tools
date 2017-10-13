const environment = process.env.NODE_ENV == 'production' ? 'production' : 'development';

exports.isDevelopment = () => environment == 'development';

exports.isProduction = () => environment == 'production';

exports.getEnvironment = () => environment;
