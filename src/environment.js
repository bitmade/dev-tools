const environment = process.env.NODE_ENV == 'production' ? 'production' : 'development';

export function isDevelopment() {
  return environment == 'development';
}

export function isProduction() {
  return !isDevelopment();
}

export function getEnvironment() {
  return environment;
}