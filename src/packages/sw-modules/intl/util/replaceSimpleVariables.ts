/**
 * Replace pure {value} variables
 *
 * message: "Price - ${value}"
 * values: { value: 100 }
 *
 * result: Price - $100
 */
const replaceSimpleVariables = (message: string, values: Intl.MessageValues = {}) =>
  Object.keys(values).reduce((acc, key) => {
    const value = values[key]

    if (value === null || value === undefined) {
      return acc
    }

    // here the ductape "() => String(value)" to fix Safari 11.* bug - '{value}'.replace(/{value}/g, '$14.95') becomes '4.95'
    return acc.replace(new RegExp(`{${key}}`, 'g'), () => String(value))
  }, message)


export default replaceSimpleVariables
