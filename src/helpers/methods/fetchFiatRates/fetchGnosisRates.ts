import { Network } from 'sdk'
import * as constants from 'helpers/constants'

import getSDK from '../getSDK'
import fetchRates from './fetchRates'
import { cacheWrapper } from './helpers'


const fetchGnosisRates = async () => {
  const sdk = getSDK({ chainId: Network.Gnosis })

  const { mintTokenValues, assetValues, swiseValues, setValues } = await fetchRates(sdk)

  return {
    [constants.tokens.gno]: assetValues,
    [constants.tokens.xdai]: setValues(1),
    [constants.tokens.swise]: swiseValues,
    [constants.tokens.osGNO]: mintTokenValues,
  }
}


export default cacheWrapper(fetchGnosisRates, 'gnosis')
