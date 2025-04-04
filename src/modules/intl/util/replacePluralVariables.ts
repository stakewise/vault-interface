import plural from './plural'
import getVariableValues from './getVariableValues'


/**
 * Replace variables with value based on passed values
 *
 * message: "{count, plural, one {# product} other {# products}}"
 * values: { count: 23 }
 *
 * result: 23 products
 */
const replacePluralVariables = (message: string, locale: string, values?: { [key: string]: any }): string => {
  const variables = message.match(/{\w+, plural,(\s\w+ {#?[^#}]+}){2,}}/g) // [ '{count, plural, one {# product} other {# products}}' ]

  if (variables?.length) {
    try {
      variables.forEach((variable) => {
        const variableValues = getVariableValues(variable)
        const valueKey = variable.match(/[^,{]+/)?.[0] // result - count
        const value = (values && valueKey) ? values[valueKey] : null // result - 23

        let variableKey
        let result

        // if value not passed set pluralKey value from the variable (first item) - other
        if (value === null || value === undefined) {
          console.error('Intl error: no variable key for plural type')
          const defaultValue = Object.keys(variableValues)[0]
          variableKey = 'other' in variableValues ? 'other' : defaultValue

          result = variableValues[variableKey].replace(/#\s?/g, '') // result - products
        }
        else {
          const pluralHandler = plural[locale]
          variableKey = pluralHandler(String(value)) // result - other

          if (!variableValues[variableKey]) {
            variableKey = 'other'
          }

          result = variableValues[variableKey].replace(/#/g, value) // result - 23 products
        }

        message = message.replace(variable, result)
      })
    }
    catch (error) {
      console.error('Intl error:', error)
    }
  }

  return message
}


export default replacePluralVariables
