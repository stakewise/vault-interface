import replaceSelectVariables from './replaceSelectVariables'


describe('module:intl/replaceSelectVariables', () => {

  it('should return passed message without changes if wrong variable template used #1', () => {
    const message = '{network, select, mainnet {correct}}'

    expect(replaceSelectVariables(message)).toEqual(message)
  })

  it('should return passed message without changes if wrong variable template used #2', () => {
    const message = '{network, select , mainnet {correct} goerli {test} kovan {error}}'

    expect(replaceSelectVariables(message)).toEqual(message)
  })

  it('should return passed message without changes if wrong variable template used #3', () => {
    const message = '{network, selectt, mainnet {correct} goerli {test} kovan {error}}'

    expect(replaceSelectVariables(message)).toEqual(message)
  })

  it('should return "other" variable value if values not passed', () => {
    const message = '{network, select, mainnet {correct} goerli {test} other {fragrance}}'
    const expected = 'fragrance'

    expect(replaceSelectVariables(message)).toEqual(expected)
    expect(replaceSelectVariables(message, {})).toEqual(expected)
    expect(replaceSelectVariables(message, { count: null })).toEqual(expected)
    expect(replaceSelectVariables(message, { count: undefined })).toEqual(expected)
  })

  it('should return "correct" (first) variable value if values not passed and "other" variable does not exist', () => {
    const message = '{network, select, mainnet {correct} goerli {test} kovan {error}}'
    const expected = 'correct'

    expect(replaceSelectVariables(message)).toEqual(expected)
  })

  it('should replace variable with passed value', () => {
    const message = '{network, select, mainnet {correct} goerli {test} kovan {error}}'
    const values = { network: 'goerli' }
    const expected = 'test'

    expect(replaceSelectVariables(message, values)).toEqual(expected)
  })

  it('should return "other" variable', () => {
    const message = '{network, select, mainnet {correct} goerli {test} kovan {error}}'
    const values = { network: 'zero' }
    const expected = 'correct'

    expect(replaceSelectVariables(message, values)).toEqual(expected)
  })

  it('should replace multiple variables', () => {
    const message = `
      {network, select, mainnet {correct} goerli {test} kovan {error}}.
      Count: {count, select, 1 {one ETH} other {ETHs}} for free.
    `
    const values = { network: 'mainnet', count: 1 }
    const expected = `
      correct.
      Count: one ETH for free.
    `

    expect(replaceSelectVariables(message, values)).toEqual(expected)
  })

})
