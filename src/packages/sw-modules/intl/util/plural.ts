// CLDR - https://www.unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

// ATTN - If you want to add new language, then need to add config here

const plural: {
  [key: string]: (value: string) => string
} = {
  en: (value: string) => {
    if (value === '1') {
      return 'one'
    }

    return 'other'
  },
  ru: (value: string) => {
    const splitedValue = String(value).split('.') || []
    const numericValue = Number(splitedValue[0])
    const includedValuesForFew = [ 2, 3, 4 ]
    const excludedValuesForFew = [ 12, 13, 14 ]

    const isOne = (
        numericValue % 10 === 1
        && numericValue % 100 !== 11
    )
    const isFew = (
        includedValuesForFew.includes(numericValue % 10)
        && !excludedValuesForFew.includes(numericValue % 100)
    )

    if (isOne) {
      return 'one'
    }

    if (isFew) {
      return 'few'
    }

    return 'other'
  },
  fr: (value: string) => {
    if (Number(value) > 0 && Number(value) < 2) {
      return 'one'
    }

    return 'other'
  },
  de: (value: string) => {
    if (value === '1') {
      return 'one'
    }

    return 'other'
  },
  es: (value: string) => {
    if (value === '1') {
      return 'one'
    }

    return 'other'
  },
  pt: (value: string) => {
    if (Number(value) > 0 && Number(value) < 2) {
      return 'one'
    }

    return 'other'
  },
  zh: () => 'other',
}

export default plural
