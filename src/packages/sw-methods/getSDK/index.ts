import { Network, StakeWiseSDK } from 'sdk'

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

    return sdk
  }

  return sdkList[chainId]
}


export default getSDK
