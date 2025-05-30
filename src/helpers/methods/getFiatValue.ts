type Input = {
  token: string
  value: string
  fiatRates: Record<string, Record<string, number>>
  currency: string
  isMinimal?: boolean
}

const getFiatValue = (params: Input) => {
  const { token, value, fiatRates, currency, isMinimal } = params

  const rate = fiatRates?.[token]?.[currency] || 0

  const result = rate * Number(value)

  if (isMinimal) {
    return result
  }

  return Number(result.toFixed(2))
}


export default getFiatValue
