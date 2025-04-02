import { Network, StakeWiseSDK } from 'sdk'
import cookie from 'sw-helpers/cookie'
import * as constants from 'helpers/constants'

import getUrls from './getUrls'


type Input = {
  chainId: Network
  library?: StakeWise.Provider
}

const sdkList = {} as Record<Network, StakeWiseSDK>

const getSDK = ({ chainId, library }: Input) => {
  if (!sdkList[chainId] || library) {
    const endpoints: StakeWise.Options['endpoints'] = getUrls({ chainId })

    const sdk = new StakeWiseSDK({
      endpoints,
      provider: library,
      network: chainId,
    })

    if (!library) {
      sdkList[chainId] = sdk
    }

    const isTestsEnabled = cookie.get(constants.cookieNames.e2e)

    if (isTestsEnabled && typeof window !== 'undefined') {
      window.e2e = {
        ...window.e2e,
        sdk,
      }
    }

    return sdk
  }

  return sdkList[chainId]
}


export default getSDK
