import getVariableValues from './getVariableValues'


type Message = string
type Values = { [key: string]: any }

const variableRegex = /{\w+, select,(\s\w+ {[^}]+}){2,}}/g

/**
 * Replace variables with value based on passed values
 *
 * message: "{network, select, mainnet {correct} goerli {test} kovan {error}}"
 * values: { network: 'mainnet' }
 *
 * result: correct
 */
const replaceSelectVariable = (message: Message,  variable: string, values?: Values): string => {
  const variableValues = getVariableValues(variable)
  const valueKey = variable?.match(/(?!{)\w+/)?.[0]
  let variableKey = (values && valueKey) ? values[valueKey] : null

  // if value not passed set value from the variable (first item)
  if (!variableKey || !variableValues[variableKey]) {
    const defaultValue = Object.keys(variableValues)[0]

    console.error('Intl error: no variable key for select type')
    variableKey = 'other' in variableValues ? 'other' : defaultValue
  }

  const result = variableValues[variableKey] // perfume

  return message.replace(variable, result)
}

const replaceSelectVariables = (message: Message, values?: Values): string => {
  const variables = message.match(variableRegex) // [ '{network, select, mainnet {correct} goerli {test} kovan {error}}' ]

  if (variables?.length) {
    try {
      variables.forEach((variable) => {
        message = replaceSelectVariable(message, variable, values)
      })
    }
    catch (err) {
      console.error(err)
    }
  }

  return message
}


export default replaceSelectVariables
