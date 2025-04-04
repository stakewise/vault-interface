type Result = { [key: string]: string }

/**
 * variable: "{network, select, mainnet {correct} goerli {test} kovan {error}}"
 *
 * result: { mainnet: 'correct', goerli: 'test', kovan: 'error' }
 */
const getVariableValues = (variable: string): Result => {
  const results = variable?.match(/[^\s]+ {[^}]*}/g)

  if (Array.isArray(results)) {
    return results.reduce((acc, item) => {
      const params = item.match(/(.+) {(.*)}/)
      const [ _, key, value ] = params || []

      return { ...acc, [key]: value }
    }, {})
  }

  return {}
}


export default getVariableValues
