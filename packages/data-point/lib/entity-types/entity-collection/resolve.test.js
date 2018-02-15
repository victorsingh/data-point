/* eslint-env jest */

const resolveCollectionEntity = require('./resolve').resolve

const FixtureStore = require('../../../test/utils/fixture-store')
const testData = require('../../../test/data.json')

const helpers = require('../../helpers')

let dataPoint
let resolveReducerBound

function transform (entityId, value, options) {
  const reducer = dataPoint.entities.get(entityId)
  const accumulator = helpers.createAccumulator(
    value,
    Object.assign(
      {
        context: reducer
      },
      options
    )
  )
  return resolveCollectionEntity(accumulator, resolveReducerBound)
}

beforeAll(() => {
  dataPoint = FixtureStore.create()
  resolveReducerBound = helpers.createReducerResolver(dataPoint)
})

beforeEach(() => {
  dataPoint.middleware.clear()
})

describe('CollectionReducer.resolve', () => {
  test('entity.collection - only process Plain Objects', () => {
    return transform('collection:ObjectsNotAllowed', testData)
      .catch(err => err)
      .then(result => {
        expect(result).toBeInstanceOf(Error)
      })
  })

  test('entity.collection - throw error if value not array', () => {
    return transform('collection:ObjectsNotAllowed', testData)
      .catch(err => err)
      .then(result => {
        expect(result).toMatchSnapshot()
      })
  })
})

describe('entity.collection.value', () => {
  test('should resolve value Transform', () => {
    return transform('collection:a.1', testData).then(acc => {
      expect(acc.value).toEqual([
        {
          d1: 2
        },
        {
          d1: 4
        }
      ])
    })
  })
})

describe('entity.collection.map', () => {
  test('should resolve map Transform', () => {
    return transform('collection:b.1', testData).then(acc => {
      expect(acc.value).toEqual([2, 4])
    })
  })

  test('should return array with undefined elements if map reducer is empty list', () => {
    return transform('collection:b.2', testData).then(acc => {
      expect(acc.value).toEqual([undefined, undefined, undefined])
    })
  })
})

describe('entity.collection.filter', () => {
  test('should resolve filter Transform', () => {
    return transform('collection:c.1', testData).then(acc => {
      expect(acc.value).toEqual([
        {
          d1: 2
        }
      ])
    })
  })

  test('it should resolve filter transform for collection containing filter property', () => {
    return transform('collection:c.2', testData).then(acc => {
      expect(acc.value).toEqual([1, 3])
    })
  })

  test('should return empty array if filter reducer is empty list', () => {
    return transform('collection:c.3', testData).then(acc => {
      expect(acc.value).toEqual([])
    })
  })
})

describe('entity.collection.find', () => {
  test('should resolve find Transform', () => {
    return transform('collection:d.1', testData).then(acc => {
      expect(acc.value).toEqual(1)
    })
  })

  test('should resolve to undefined if none found', () => {
    return transform('collection:d.2', testData).then(acc => {
      expect(acc.value).toBeUndefined()
    })
  })

  test('should return undefined if find reducer is empty list', () => {
    return transform('collection:d.3', testData).then(acc => {
      expect(acc.value).toEqual(undefined)
    })
  })
})

describe('entity.collection.compose', () => {
  test('should resolve one modifier', () => {
    return transform('collection:j.1', testData).then(acc => {
      expect(acc.value).toEqual([2, 4])
    })
  })

  test('should resolve multiple modifiers', () => {
    return transform('collection:j.2', testData).then(acc => {
      expect(acc.value).toBe(10)
    })
  })

  test('map should handle error and rethrow with appended information', () => {
    return transform('collection:j.3', testData)
      .catch(err => err)
      .then(acc => {
        expect(acc).toBeInstanceOf(Error)
      })
  })

  test('find should handle error and rethrow with appended information', () => {
    return transform('collection:j.4', testData)
      .catch(err => err)
      .then(acc => {
        expect(acc).toBeInstanceOf(Error)
      })
  })

  test('filter should handle error and rethrow with appended information', () => {
    return transform('collection:j.5', testData)
      .catch(err => err)
      .then(acc => {
        expect(acc).toBeInstanceOf(Error)
      })
  })
})
