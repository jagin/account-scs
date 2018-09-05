const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/account/{lang}', config: Handlers.index },
  { method: 'GET', path: '/account/{lang}/login', config: Handlers.login },
  { method: 'GET', path: '/account/{lang}/partials/menu', config: Handlers.partials.menu }
]
