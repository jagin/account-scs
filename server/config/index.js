const Joi = require('joi')
const Package = require('../../package')

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  HOST: Joi.string()
    .default('localhost'),
  PORT: Joi.number()
    .default(8000),
  JWT_KEY: Joi.string(),
  JWT_AUDIENCE: Joi.string()
    .allow(''),
  JWT_ISSUER: Joi.string()
    .allow(''),
  JWT_COOKIE_DOMAIN: Joi.string()
    .default('localhost'),
  AUTH0_COOKIE_PASSWORD: Joi.string()
    .required(),
  AUTH0_CLIENT_ID: Joi.string()
    .required(),
  AUTH0_CLIENT_SECRET: Joi.string()
    .required(),
  AUTH0_DOMAIN: Joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)

const config = {
  scs: 'account',
  version: Package.version,
  env: envVars.NODE_ENV,
  isDevelopment: envVars.NODE_ENV === 'development',
  isTest: envVars.NODE_ENV === 'test',
  isProduction: envVars.NODE_ENV === 'production',
  jwt: {
    key: envVars.JWT_KEY,
    audience: envVars.JWT_AUDIENCE,
    issuer: envVars.JWT_ISSUER,
    cookieDomain: envVars.JWT_COOKIE_DOMAIN
  },
  auth0: {
    cookiePassword: envVars.AUTH0_COOKIE_PASSWORD,
    clientId: envVars.AUTH0_CLIENT_ID,
    clientSecret: envVars.AUTH0_CLIENT_SECRET,
    domain: envVars.AUTH0_DOMAIN
  }
}

config.manifest = {
  server: {
    app: config,
    host: envVars.HOST,
    port: envVars.PORT,
    router: {
      stripTrailingSlash: true
    }
  },
  register: {
    plugins: [
      { plugin: 'inert' },
      { plugin: 'vision' },
      { plugin: 'bell' },
      { plugin: 'hapi-auth-jwt2' },
      {
        plugin: './i18n',
        options: {
          supportedLngs: ['en', 'pl'],
          fallbackLng: config.isProduction ? 'en' : 'dev',
          saveMissing: config.isDevelopment
        }
      },
      {
        plugin: './auth',
        options: {
          jwt: {
            key: config.jwt.key,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            ignoreExpiration: !config.isProduction
          }
        }
      },
      { plugin: './auth/auth0' },
      { plugin: './assets' },
      { plugin: './views' },
      {
        plugin: './metrics',
        options: {
          ignorePaths: [
            '/health-check',
            '/metrics',
            '/account/assets'
          ]
        }
      },
      { plugin: './health-check' },
      {
        plugin: 'good',
        options: {
          ops: { interval: 60000 },
          reporters: {
            console: [
              { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', request: '*', response: '*', error: '*' }] },
              { module: 'good-console' },
              'stdout'
            ]
          }
        }
      }
    ]
  }
}

if (!config.isProduction) {
  config.manifest.register.plugins.push({
    plugin: 'blipp'
  })
} else {
  config.manifest.server.debug = false
}

config.validate = function () {
  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }

  return this
}

module.exports = config
