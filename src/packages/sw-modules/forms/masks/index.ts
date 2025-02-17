export const createMask = (formula: string) => {
  const patternArray = formula.split('')

  return (value: string) => {
    if (!value) {
      return ''
    }

    let result = '', index = 0

    for (let i = 0; i < patternArray.length; i++) {
      if (index >= value.length) {
        break
      }

      const symbol = patternArray[i]

      if (symbol === 'X' || symbol === value[index]) {
        result += value[index++]
      }
      else {
        result += symbol
      }
    }

    return result
  }
}

type CreateMaskWithModifiers = (params: {
  mask: string
  preModify?: (value: string) => string
  postModify?: (value: string) => string
}) => (value: string) => string

type Mask = ReturnType<CreateMaskWithModifiers>

const createMaskWithModifiers: CreateMaskWithModifiers = ({ mask, preModify, postModify }) => {
  const applyMask = mask ? createMask(mask) : null

  return (value) => {
    let newValue = value

    if (typeof preModify === 'function') {
      newValue = preModify(newValue)
    }

    if (typeof applyMask === 'function') {
      newValue = applyMask(newValue)
    }

    if (typeof postModify === 'function') {
      newValue = postModify(newValue)
    }

    return newValue
  }
}

// Mask result - YYYY-MM-DD
const initDateMask = (): Mask => {
  const preModify = (value: string) => value.replace(/\D/g, '')

  const postModify = (value: string) => {
    let [ year, month, day ] = value.split('-')

    const monthNumber = Number(month)
    const dayNumber = Number(day)
    const yearNumber = Number(year)

    if (day) {
      const hasMonthAndYear = month && year?.length === 4
      const maxDaysInMonth = hasMonthAndYear ? new Date(yearNumber, monthNumber, 0).getDate() : 31

      if (dayNumber > maxDaysInMonth) {
        day = String(maxDaysInMonth)
      }
    }

    if (month && monthNumber > 12) {
      month = '12'
    }

    if (year) {
      const minYearValue = '2020'.substring(0, year.length)
      const maxYearValue = new Date().getFullYear().toString().substring(0, year.length)

      if (yearNumber < Number(minYearValue)) {
        year = minYearValue
      }
      else if (yearNumber > Number(maxYearValue)) {
        year = maxYearValue
      }
    }

    return [ year, month, day ].filter(Boolean).join('-')
  }

  return createMaskWithModifiers({
    mask: 'XXXX-XX-XX',
    preModify,
    postModify,
  })
}


export default {
  date: initDateMask(),
}
