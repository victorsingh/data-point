const _ = require('lodash')
const Promise = require('bluebird')
const resolveReducer = require('../reducer-types').resolve
const AccumulatorFactory = require('../accumulator/factory')
const util = require('util')

// putting utils in here causes circular dependancy

const { stubFactories } = require('../reducer-types/reducer-helpers')

module.exports.helpers = {
  assign: stubFactories.assign,
  constant: stubFactories.constant,
  filter: stubFactories.filter,
  find: stubFactories.find,
  map: stubFactories.map,
  omit: stubFactories.omit,
  parallel: stubFactories.parallel,
  pick: stubFactories.pick,
  withDefault: stubFactories.withDefault
}

module.exports.entityFactories = require('../entity-types').factories

module.exports.isReducer = require('../reducer-types').isReducer

module.exports.createReducer = require('../reducer-types').create

module.exports.createEntity = require('../entity-types/base-entity').create

module.exports.resolveEntity = require('../entity-types/base-entity/resolve').resolve

module.exports.validateEntityModifiers = require('../entity-types/validate-modifiers').validateModifiers

function reducify (method) {
  return function () {
    const partialArguments = Array.prototype.slice.call(arguments)
    return function (value) {
      const methodArguments = [value].concat(partialArguments)
      return method.apply(null, methodArguments)
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
  return pcb(acc.value, acc).then(val => ({ value: val }))
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

/**
 * sets key to value of a copy of target. target stays untouched, if key is
 * an object, then the key will be taken as an object and merged with target
 * @param {Object} target
 * @param {string|Object} key
 * @param {*} value
 */
function set (target, key, value) {
  const obj = {}
  obj[key] = value
  return Object.assign({}, target, obj)
}

module.exports.set = set

function assign (target, toMerge) {
  return Object.assign({}, target, toMerge)
}

module.exports.assign = assign

let uid = 0
function getUID () {
  uid++
  return uid
}

module.exports.getUID = getUID

/**
 * request: https://stackoverflow.com/a/28475765
 * This method has not been tested for performance
 * and could be flawed its only purpose is for error messages
 * @param {*} value
 */
function typeOf (value) {
  return {}.toString
    .call(value)
    .split(' ')[1]
    .slice(0, -1)
    .toLowerCase()
}

module.exports.typeOf = typeOf

/**
 * @param {Accumulator} acc
 * @param {Object} data
 */
function inspect (acc, data) {
  const log = []
  log.push('\n\x1b[33minspect\x1b[0m:', _.get(acc, 'reducer.spec.id'))
  for (let key in data) {
    const value = data[key]
    log.push(`\n${key}:`, _.attempt(JSON.stringify, value, null, 2))
  }

  console.info.apply(null, log)
}

module.exports.inspect = inspect

/**
 * @param {*} obj - object to inspect
 * @param {Array} props - properties to inspect
 * @param {string} indent - indent to be used on each key
 */
function inspectProperties (obj, props, indent = '') {
  return props.reduce((acc, key) => {
    const val = obj[key]
    if (typeof val !== 'undefined') {
      return `${acc}${indent}- ${key}: ${util.inspect(obj[key], {
        breakLength: 0
      })}\n`
    }
    return acc
  }, '')
}

module.exports.inspectProperties = inspectProperties

function isFalsy (val) {
  return val === null || val === false || typeof val === 'undefined'
}

module.exports.isFalsy = isFalsy
