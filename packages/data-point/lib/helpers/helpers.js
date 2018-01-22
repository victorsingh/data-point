const _ = require('lodash')
const Promise = require('bluebird')
const resolveReducer = require('../reducer-types').resolve
const AccumulatorFactory = require('../accumulator/factory')

const { stubFactories } = require('../reducer-types/reducer-helpers')
const typeCheckFunctionReducers = require('./type-check-function-reducers')

module.exports.helpers = {
  assign: stubFactories.assign,
  filter: stubFactories.filter,
  find: stubFactories.find,
  map: stubFactories.map,
  omit: stubFactories.omit,
  pick: stubFactories.pick,
  isString: typeCheckFunctionReducers.isString,
  isNumber: typeCheckFunctionReducers.isNumber,
  isBoolean: typeCheckFunctionReducers.isBoolean,
  isFunction: typeCheckFunctionReducers.isFunction,
  isError: typeCheckFunctionReducers.isError,
  isArray: typeCheckFunctionReducers.isArray,
  isObject: typeCheckFunctionReducers.isObject
}

module.exports.isReducer = require('../reducer-types').isReducer

module.exports.createReducer = require('../reducer-types').create

module.exports.createEntity = require('../entity-types/base-entity').create

module.exports.resolveEntity = require('../entity-types/base-entity/resolve').resolve

function reducify (method) {
  return function () {
    const partialArguments = Array.prototype.slice.call(arguments)
    return function (acc, done) {
      const methodArguments = [acc.value].concat(partialArguments)
      const result = method.apply(null, methodArguments)
      if (_.isError(result)) {
        return done(result)
      }
      done(null, result)
    }
  }
}

module.exports.reducify = reducify

function reducifyAll (source, methodList) {
  let target = source
  if (!_.isEmpty(methodList)) {
    target = _.pick(source, methodList)
  }
  return _.mapValues(target, reducify)
}

module.exports.reducifyAll = reducifyAll

function mockReducer (reducer, acc) {
  const pcb = Promise.promisify(reducer)
  return pcb(acc).then(val => ({ value: val }))
}

module.exports.mockReducer = mockReducer

function createAccumulator (value, options) {
  return AccumulatorFactory.create(
    Object.assign(
      {
        value
      },
      options
    )
  )
}

module.exports.createAccumulator = createAccumulator

function createReducerResolver (dataPoint) {
  return resolveReducer.bind(null, dataPoint)
}

module.exports.createReducerResolver = createReducerResolver
