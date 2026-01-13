import { useCallback, useMemo } from 'react'
import type { OrderStatus } from '@cowprotocol/cow-sdk'

import useSwapSDK from './useSwapSDK'


type WaitForTradeOutput = {
  hash?: string
  status?: OrderStatus
  buyToken: string
  sellToken: string
  buyAmount: string
  sellAmount: string
}

const useOrderId = () => {
  const getSwapSDK = useSwapSDK()

  const fetchOrder = useCallback(async (orderId: string, count: number = 0) => {
    try {
      const { orderBookApi } = await getSwapSDK()

      const order = await orderBookApi.getOrder(orderId)

      if (order) {
        return order
      }

      throw new Error('Order not found')
    }
    catch (error) {
      if (count < 10) {
        await new Promise((resolve) => setTimeout(resolve, count * 300))

        return fetchOrder(orderId, count + 1)
      }

      throw new Error(error as string)
    }
  }, [ getSwapSDK ])

  const waitForTrade = useCallback(async (orderId: string): Promise<WaitForTradeOutput> => {
    try {
      const { orderBookApi } = await getSwapSDK()

      const { status, buyAmount, sellAmount, sellToken, buyToken } = await orderBookApi.getOrder(orderId)
      const isExpired = status === 'expired'
      const isCancelled = status === 'cancelled'

      if (isExpired || isCancelled) {
        if (isExpired) {
          console.error('Swap failed', undefined, {
            orderId,
            status,
            sellToken,
            sellAmount,
          })
        }

        return {
          status,
          buyToken,
          sellToken,
          buyAmount,
          sellAmount,
        }
      }

      const trades = await orderBookApi.getTrades({ orderUid: orderId })
      const hash = trades[0]?.txHash as string

      if (hash) {
        return {
          hash,
          buyToken,
          sellToken,
          buyAmount,
          sellAmount,
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      return waitForTrade(orderId)
    }
    catch (error) {
      throw new Error(error as string)
    }
  }, [ getSwapSDK ])

  return useMemo(() => ({
    fetchOrder,
    waitForTrade,
  }), [
    fetchOrder,
    waitForTrade,
  ])
}


export default useOrderId
