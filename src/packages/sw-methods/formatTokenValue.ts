import { formatEther } from 'ethers'

import addNumberSeparator from './addNumberSeparator'


const minimalValue = 0.0001

const _formatRemainder = (value: string, rest = 4) => {
  if (!Number(value)) {
    return '00'
  }

  let shortValue = value.slice(0, rest)
  shortValue = shortValue.replace(/0+$/, '')

  return shortValue.length >= 2
    ? shortValue
    : value.slice(0, 2)
}

const _reduceValue = (value: number, divider: number, postfix: string) => {
  const [ integer, remainder ] = String(value / divider).split('.')

  return `${addNumberSeparator(integer)}.${_formatRemainder(remainder, 2)}${postfix}`
}

const formatTokenValue = (value: bigint | string, isMinimalValueShow: boolean = false) => {
  try {
    const isBigInt = typeof value === 'bigint'

    let result = isBigInt ? formatEther(value) : value

    // 4999.. => 5000.. (solves the -1wei in actions problem)
    result = Number(result).toFixed(5)

    if (!Number(result)) {
      return '0.00'
    }

    if (isMinimalValueShow && Number(result) > 0 && Number(result) < minimalValue) {
      return '< 0.0001'
    }

    const isNegative = /^-/.test(result)
    const formattedValue = isNegative ? result.replace(/^-/, '') : result

    let [ integer, remainder ] = formattedValue.split('.')

    // 0001 => 1
    const numberInteger = Number(integer)

    let resultInteger = integer
    let resultRemainder: string | null = remainder

    if (numberInteger <= 9) {
      resultRemainder = _formatRemainder(remainder, 5)
    }
    else if (numberInteger <= 99 ) {
      resultRemainder = _formatRemainder(remainder, 4)
    }
    else if (numberInteger <= 999 ) {
      resultRemainder = _formatRemainder(remainder, 3)
    }
    else if (numberInteger <= 9_999 ) {
      resultRemainder = _formatRemainder(remainder, 2)
      resultInteger = numberInteger.toLocaleString('en-US')
    }
    else if (numberInteger <= 99_999 ) {
      resultInteger = _reduceValue(numberInteger, 1000, 'k')
      resultRemainder = null
    }
    else if (numberInteger <= 999_999 ) {
      resultInteger = _reduceValue(numberInteger, 1000, 'k')
      resultRemainder = null
    }
    else if (numberInteger <= 999_999_999) {
      resultInteger = _reduceValue(numberInteger, 1_000_000, 'm')
      resultRemainder = null
    }
    else {
      resultInteger = _reduceValue(numberInteger, 1_000_000_000, 'b')
      resultRemainder = null
    }

    return `${isNegative ? '-' : ''}${resultInteger}${resultRemainder ? `.${resultRemainder}` : ''}`
  }
  catch (error) {
    console.error(error)

    return '0.00'
  }
}


export default formatTokenValue
