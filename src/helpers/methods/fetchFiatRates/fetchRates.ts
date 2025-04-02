import { createSetValues } from './helpers'


const fetchRates = async (sdk: SDK) => {
  const [ mintTokenRate, rates ] = await Promise.all([
    sdk.osToken.getRate(),
    sdk.utils.getFiatRates(),
  ])

  const setValues = createSetValues({
    EUR: rates['USD/EUR'],
    GBP: rates['USD/GBP'],
    CNY: rates['USD/CNY'],
    JPY: rates['USD/JPY'],
    KRW: rates['USD/KRW'],
    AUD: rates['USD/AUD'],
  })

  const assetValues = setValues(rates['ASSET/USD'])
  const swiseValues = setValues(rates['SWISE/USD'])
  const mintTokenValues = setValues(rates['ASSET/USD'] * Number(mintTokenRate))

  return {
    mintTokenValues,
    assetValues,
    swiseValues,
    setValues,
  }
}


export default fetchRates
