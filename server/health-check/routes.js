const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/account/health-check', config: Handlers.healthCheck }
]
