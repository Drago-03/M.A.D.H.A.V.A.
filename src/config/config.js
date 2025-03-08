const config = {
  development: {
    mainServiceUrl: 'http://localhost:5000',
    redisUrl: 'redis://localhost:6379',
    logLevel: 'debug',
    gatewayPort: 4000
  },
  production: {
    mainServiceUrl: process.env.MAIN_SERVICE_URL,
    redisUrl: process.env.REDIS_URL,
    logLevel: 'info',
    gatewayPort: process.env.GATEWAY_PORT
  },
  test: {
    mainServiceUrl: 'http://localhost:5000',
    redisUrl: 'redis://localhost:6379',
    logLevel: 'debug',
    gatewayPort: 4000
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
