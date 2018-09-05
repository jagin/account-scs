const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/account/metrics', config: Handlers.metrics }
]
