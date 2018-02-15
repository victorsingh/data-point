const _ = require('lodash')
const Promise = require('bluebird')
const utils = require('../../utils')
const Util = require('util')

/**
 * NOTE: as expensive as this might be, this is to avoid 'surprises'
 * @param {Accumulator} acc
 * @return {Promise<Accumulator>}
 */
function validateAsObject (acc) {
  const entity = acc.reducer.spec
  if (_.isPlainObject(acc.value)) {
    return acc
  }
  return Promise.reject(
    new Error(
      Util.format(
        '%s received value = %s of type %s,',
        entity.id,
        _.truncate(Util.inspect(acc.value, { breakLength: Infinity }), {
          length: 30
        }),
        utils.typeOf(acc.value),
        'this entity only resolves plain Objects. More info https://github.com/ViacomInc/data-point/tree/master/packages/data-point#hash-entity'
      )
    )
  )
}

/**
 * @param {Accumulator} accumulator
 * @param {Function} resolveReducer
 */
function resolve (accumulator, resolveReducer) {
  const entity = accumulator.reducer.spec

  return resolveReducer(accumulator, entity.value)
    .then(validateAsObject)
    .then(acc => resolveReducer(acc, entity.compose))
}

module.exports.resolve = resolve
