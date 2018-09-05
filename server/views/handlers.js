const Joi = require('joi')

module.exports.index = {
  handler: function (request, h) {
    return h.view('index')
  }
}

module.exports.login = {
  handler: function (request, h) {
    const returnToUrl = request.query.returnTo || '/'

    return h.view('login', { returnToUrl }, { layout: false })
  }
}

module.exports.partials = {
  menu: {
    handler: async function (request, h) {
      const config = request.server.settings.app
      const scs = request.query.scs

      return h.view('partials/menu', { scs, active: scs === config.scs }, { layout: false })
    },
    validate: {
      query: {
        scs: Joi.string().required().valid(['home', 'items', 'account'])
      }
    }
  }
}
