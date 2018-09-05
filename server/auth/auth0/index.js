const Hoek = require('hoek')
const Routes = require('./routes')

module.exports = {
  name: 'auth0',

  register (server, options) {
    const config = server.settings.app
    const auth0Defaults = {
      provider: 'auth0',
      password: config.auth0.cookiePassword,
      clientId: config.auth0.clientId,
      clientSecret: config.auth0.clientSecret,
      isSecure: config.isProduction,
      isHttpOnly: config.isProduction,
      // https://auth0.com/docs/scopes/current
      scope: ['openid', 'offline_access', 'email', 'name', 'nickname', 'picture'],
      config: {
        domain: config.auth0.domain
      }
    }
    const auth0Options = Hoek.applyToDefaults(auth0Defaults, options || {})

    server.auth.strategy('auth0', 'bell', auth0Options)

    server.route(Routes)
  }
}
