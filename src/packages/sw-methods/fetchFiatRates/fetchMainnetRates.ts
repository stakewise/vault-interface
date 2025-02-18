import { Network } from 'sdk'
import * as constants from 'sw-helpers/constants'

import getSDK from '../getSDK'
import fetchRates from './fetchRates'
import { cacheWrapper } from './helpers'


const fetchMainnetRates = async () => {
  const sdk = getSDK({ chainId: Network.Mainnet })

  const { mintTokenValues, assetValues, swiseValues } = await fetchRates(sdk)

  return {
    [constants.tokens.eth]: assetValues,
    [constants.tokens.rETH2]: assetValues,
    [constants.tokens.sETH2]: assetValues,
    [constants.tokens.swise]: swiseValues,
    [constants.tokens.osETH]: mintTokenValues,
  }
}


export default cacheWrapper(fetchMainnetRates, 'mainnet')
