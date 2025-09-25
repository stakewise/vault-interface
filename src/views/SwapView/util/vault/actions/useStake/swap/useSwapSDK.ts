import { useCallback } from 'react'
import { useConfig } from 'config'
import type { SupportedChainId } from '@cowprotocol/cow-sdk'


const useSwapSDK = () => {
  const { chainId } = useConfig()

  return useCallback(async () => {
    const { OrderBookApi, OrderQuoteSideKindSell, OrderSigningUtils } = await import('@cowprotocol/cow-sdk')
    const { signOrder, signOrderCancellations } = OrderSigningUtils

    return {
      kind: OrderQuoteSideKindSell.SELL,
      signOrder,
      signOrderCancellations,
      orderBookApi: new OrderBookApi({
        chainId: chainId as SupportedChainId,
      }),
    }
  }, [ chainId ])
}


export default useSwapSDK
