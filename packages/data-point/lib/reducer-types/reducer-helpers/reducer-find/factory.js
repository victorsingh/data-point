const REDUCER_FIND = 'ReducerFind'

module.exports.type = REDUCER_FIND

const HELPER_NAME = 'find'

module.exports.name = HELPER_NAME

/**
 * @class
 * @property {string} type
 * @property {reducer} reducer
 */
function ReducerFind () {
  this.type = REDUCER_FIND
  this.reducer = undefined
}

module.exports.Constructor = ReducerFind

/**
 * @param {Function} createReducer
 * @param {*} source - raw source for a reducer
 * @return {ReducerFind}
 */
function create (createReducer, source) {
  const reducer = new ReducerFind()
  reducer.reducer = createReducer(source)
  return reducer
}

module.exports.create = create
