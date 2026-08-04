import getVariableValues from './getVariableValues'


describe('module:intl/getVariableValues', () => {

  it('should transform variable string to values map', () => {
    const message = '{network, select, mainnet {correct} goerli {test} kovan {error}}'
    const expected = { mainnet: 'correct', goerli: 'test', kovan: 'error' }

    expect(getVariableValues(message)).toStrictEqual(expected)
  })
})
