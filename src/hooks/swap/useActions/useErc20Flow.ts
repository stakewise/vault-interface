import { useMemo, useCallback } from 'react'
import { StakeStep } from 'helpers/enums'
import type { TradeParameters } from '@cowprotocol/cow-sdk'

import { SetTransaction, Transactions } from 'components'

import useTrade from './useTrade'
import useSwapSDK from '../useSwapSDK'


type Input = {
  step: StakeStep.Swap
  setCancelAvailable: (isCancelAvailable: boolean) => void
}

type CancelOrderInput = {
  setCancelling: (isCancelling: boolean) => void
  setTransaction: SetTransaction
}

type SendOrderInput = {
  quoteRequest: TradeParameters
  setTransaction: SetTransaction
}

const useErc20Flow = (values: Input) => {
  const { step, setCancelAvailable } = values

  const getSwapSDK = useSwapSDK()

  const { orderIdRef, handleTrade, setOrderId } = useTrade({
    step,
    setCancelAvailable,
  })

  const sendOrder = useCallback(async (values: SendOrderInput) => {
    const { quoteRequest, setTransaction } = values

    const { tradingSdk } = await getSwapSDK()

    const { orderId } = await tradingSdk.postSwapOrder(quoteRequest)

    return handleTrade({ orderId, setTransaction })
  }, [ getSwapSDK, handleTrade ])

  const cancelOrder = useCallback(async (values: CancelOrderInput) => {
    const { setCancelling, setTransaction } = values

    // ATTN we need orderIdRef since orderId is null at the moment of TxFlowModal opening
    if (!orderIdRef.current) {
      return
    }

    setCancelling(true)
    setTransaction(step, Transactions.Status.Canceling)

    try {
      const { tradingSdk } = await getSwapSDK()

      const success = await tradingSdk.offChainCancelOrder({
        orderUid: orderIdRef.current,
      })

      if (success) {
        setOrderId(null)
        setTransaction(step, Transactions.Status.Cancel, true)
      }
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setCancelling(false)
    }
  }, [ step, orderIdRef, getSwapSDK, setOrderId ])

  return useMemo(() => ({
    sendOrder,
    cancelOrder,
  }), [
    sendOrder,
    cancelOrder,
  ])
}


export default useErc20Flow
