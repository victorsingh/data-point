const Util = require('util')
const truncate = require('lodash/truncate')
const isPlainObject = require('lodash/isPlainObject')

const {
  set,
  assign,
  getUID,
  typeOf,
  inspect,
  inspectProperties,
  isFalsey
} = require('../helpers')

const utils = {
  set: set,
  assign: assign,
  getUID: getUID,
  typeOf: typeOf,
  inspect: inspect,
  inspectProperties: inspectProperties,
  isFalsey: isFalsey
}

/**
 * @param {Function} typeCheckFunction
 * @param {String} expectedType
 * @return {Function}
 */
function createTypeCheckReducer (typeCheckFunction, expectedType) {
  console.log('what happned here?')
  return function typeCheckReducer (value) {
    const result = typeCheckFunction(value)
    if (result === true) {
      return value
    }

    let message = getErrorMessage(value, expectedType)
    if (typeof result === 'string') {
      message += `\n${result}`
    }

    throw new Error(message)
  }
}

module.exports.createTypeCheckReducer = createTypeCheckReducer

/**
 * @param {*} value
 * @param {String} expectedType
 * @return {String}
 */
function getErrorMessage (value, expectedType) {
  return `Entity type check failed!\n${
    expectedType ? `Expected type: ${expectedType}\n` : ''
  }Actual type: ${utils.typeOf(value)}\nInput value: ${truncate(
    Util.inspect(value, { breakLength: Infinity }),
    {
      length: 30
    }
  )}`
}

module.exports = {
  createTypeCheckReducer,
  defaults: {
    isString: createTypeCheckReducer(
      value => typeof value === 'string',
      'string'
    ),
    isNumber: createTypeCheckReducer(
      value => typeof value === 'number',
      'number'
    ),
    isBoolean: createTypeCheckReducer(
      value => typeof value === 'boolean',
      'boolean'
    ),
    isFunction: createTypeCheckReducer(
      value => typeof value === 'function',
      'function'
    ),
    isError: createTypeCheckReducer(value => value instanceof Error, 'error'),
    isArray: createTypeCheckReducer(value => Array.isArray(value), 'array'),
    isObject: createTypeCheckReducer(value => isPlainObject(value), 'object')
  }
}
