import { createSetValues } from './helpers'


const fetchRates = async (sdk: SDK) => {
  const rates = await sdk.utils.getFiatRates()

  const setValues = createSetValues({
    EUR: rates['USD/EUR'],
    GBP: rates['USD/GBP'],
    CNY: rates['USD/CNY'],
    JPY: rates['USD/JPY'],
    KRW: rates['USD/KRW'],
    AUD: rates['USD/AUD'],
  })

  const ssvValues = setValues(rates['SSV/USD'])
  const obolValues = setValues(rates['OBOL/USD'])
  const assetValues = setValues(rates['ASSET/USD'])
  const swiseValues = setValues(rates['SWISE/USD'])
  const mintTokenValues = setValues(rates['osToken/USD'])

  return {
    mintTokenValues,
    assetValues,
    swiseValues,
    obolValues,
    ssvValues,
    setValues,
  }
}


export default fetchRates
