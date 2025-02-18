import { Network, StakeWiseSDK } from 'sdk'

import getUrls from './getUrls'


type Input = {
  chainId: Network
  library?: StakeWise.Provider
  token?: string
}

const sdkList = {} as Record<Network, StakeWiseSDK>

const getSDK = ({ chainId, library, token }: Input) => {
  if (!sdkList[chainId] || library || token) {
    const endpoints: StakeWise.Options['endpoints'] = getUrls({ chainId, token })

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
