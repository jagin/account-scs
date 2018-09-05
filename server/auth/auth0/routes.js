const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/account/auth0/login', config: Handlers.auth0Login },
  { method: 'GET', path: '/account/auth0/logout', config: Handlers.auth0Logout },
  { method: 'GET', path: '/account/logout', config: Handlers.logout }
]
