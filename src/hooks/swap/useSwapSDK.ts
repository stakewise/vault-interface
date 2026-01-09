import { useCallback } from 'react'
import { useConfig } from 'config'
import { ZeroAddress, VoidSigner } from 'ethers'
import type { SupportedChainId } from '@cowprotocol/cow-sdk'


const useSwapSDK = () => {
  const { signSDK, chainId, address } = useConfig()

  const getSigner = useCallback(() => (
    address
      ? signSDK.provider.getSigner()
      : new VoidSigner(ZeroAddress, signSDK.provider)
  ), [ signSDK, address ])

  return useCallback(async () => {
    const [
      signer,
      {
        OrderKind,
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
      kind: {
        sell: OrderKind.SELL,
        buy: OrderKind.BUY,
      },
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
