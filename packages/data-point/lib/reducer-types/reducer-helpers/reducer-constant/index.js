const factory = require('./factory')
const resolve = require('./resolve').resolve

module.exports = {
  create: factory.create,
  type: factory.type,
  name: factory.name,
  resolve: resolve,
  factory: factory.Constructor
}
