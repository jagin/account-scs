const Boom = require('boom')

function getTokenCookieOptions (config) {
  const tokenCookieOptions = {
    // expires 10 days from today
    ttl: 10 * 24 * 60 * 60 * 1000,
    // we already used JWT to encode
    encoding: 'none',
    // require https on production
    isSecure: config.isProduction,
    // prevent client alteration on production
    isHttpOnly: config.isProduction,
    // remove invalid cookies
    clearInvalid: true,
    // don't allow violations of RFC 6265
    strictHeader: true,
    // set the cookie for all routes
    path: '/',
    // set the cookie for the domain
    domain: config.jwt.cookieDomain
  }

  return tokenCookieOptions
}

module.exports.auth0Login = {
  handler: function (request, h) {
    const config = request.server.settings.app

    if (!request.auth.isAuthenticated) {
      throw Boom.unauthorized('Authentication failed: ' + request.auth.error.message)
    }

    const lang = request.auth.credentials.query.lang || request.i18n.language
    const returnToUrl = request.auth.credentials.query.returnTo || '%2F'

    return h.redirect(`/account/${lang}/login?returnTo=${returnToUrl}`)
      .state('token', request.auth.artifacts.id_token, getTokenCookieOptions(config))
  },
  auth: 'auth0'
}

module.exports.auth0Logout = {
  handler: function (request, h) {
    const config = request.server.settings.app

    const auth0BaseUrl = `https://${config.auth0.domain}`
    const returnToUrl = request.query.returnTo || '%2F'
    const logoutReturnToUrl = encodeURIComponent(`${request.headers['x-forwarded-proto'] || request.server.info.protocol}://${request.info.host}/account/logout?returnTo=${returnToUrl}`)

    return h.redirect(`${auth0BaseUrl}/v2/logout?returnTo=${logoutReturnToUrl}&client_id=${config.auth0.clientId}`)
  }
}

module.exports.logout = {
  handler: function (request, h) {
    const config = request.server.settings.app
    const returnToUrl = request.query.returnTo || '%2F'

    return h.redirect(decodeURIComponent(returnToUrl))
      .unstate('token', getTokenCookieOptions(config))
  }
}
