type Input = {
  token: string
  value: string
  fiatRates: Record<string, Record<string, number>>
  currency: string
}

const getFiatValue = (params: Input) => {
  const { token, value, fiatRates, currency } = params

  const rate = fiatRates?.[token]?.[currency] || 0

  return Number((rate * Number(value)).toFixed(2))
}


export default getFiatValue
