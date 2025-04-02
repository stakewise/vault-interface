import methods from 'helpers/methods'


const _reduceValue = (value: number, divider: number = 1, postfix: string = '', decimal = 2) => {
  const [ integer, remainder ] = (value / divider).toFixed(2).split('.')

  if (!decimal) {
    return `${methods.addNumberSeparator(integer)}${postfix}`
  }

  return `${methods.addNumberSeparator(integer)}.${remainder?.slice(0, decimal)}${postfix}`
}

const numericalReduction = (value: number, decimal?: 0 | 2): string => {
  if (isNaN(value)) {
    return _reduceValue(0, 2)
  }

  if (value < 0) {
    return `-${numericalReduction(Math.abs(value), decimal)}`
  }

  if (value >= 1_000_000_000) {
    return _reduceValue(value, 1_000_000_000, 'b', decimal)
  }

  if (value >= 1_000_000) {
    return _reduceValue(value, 1_000_000, 'm', decimal)
  }

  if (value >= 10_000) {
    return _reduceValue(value, 1_000, 'k', decimal)
  }

  return _reduceValue(value)
}


export default numericalReduction
