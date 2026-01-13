import { useCallback } from 'react'
import { useConfig } from 'config'
import type { SupportedChainId } from '@cowprotocol/cow-sdk'

import useSigner from './useSigner'


const useSwapSDK = () => {
  const { signSDK, chainId } = useConfig()

  const getSigner = useSigner()

  return useCallback(async () => {
    const [
      signer,
      {
        TradingSdk,
        OrderBookApi,
        setGlobalAdapter,
      },
      { EthersV6Adapter },
    ] = await Promise.all([
      getSigner(),
      import('@cowprotocol/cow-sdk'),
      import('@cowprotocol/sdk-ethers-v6-adapter'),
    ])

    const cowSdkAdapter = new EthersV6Adapter({
      provider: signSDK.provider,
      signer,
    })

    setGlobalAdapter(cowSdkAdapter)

    return {
      tradingSdk: new TradingSdk({
        signer,
        appCode: 'StakeWise',
        chainId: chainId as SupportedChainId,
      }),
      orderBookApi: new OrderBookApi({
        chainId: chainId as SupportedChainId,
      }),
    }
  }, [ signSDK, chainId, getSigner ])
}


export default useSwapSDK
