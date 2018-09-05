const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/account/assets/{param*}', config: Handlers.public }
]
