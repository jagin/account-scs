module.exports = function (key, options) {
  return options.data.root.i18n.t(key, options.hash)
}
