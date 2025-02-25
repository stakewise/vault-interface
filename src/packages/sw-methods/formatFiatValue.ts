import numericalReduction from './numericalReduction'


type Input = {
  value: number
  currencySymbol: string
  isMinimal?: boolean
}

const formatFiatValue = ({ value, currencySymbol, isMinimal }: Input) => {
  let formattedResult = numericalReduction(value)

  if (isMinimal && formattedResult === '0.00' && Number(value)) {
    formattedResult = `< ${currencySymbol} 0.01`
  }
  else {
    formattedResult = `${currencySymbol} ${formattedResult}`
  }

  return formattedResult
}


export default formatFiatValue
