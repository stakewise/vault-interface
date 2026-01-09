import { useMemo, useCallback, useState, useRef } from 'react'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'
import { useActions } from 'hooks'

import { SetTransaction, Transactions } from 'components'

import useOrderId from '../useOrderId'


type Input = {
  step: StakeStep.Swap
  setCancelAvailable: (isCancelAvailable: boolean) => void
}

type HandleTrade = {
  orderId?: string
  setTransaction: SetTransaction
}

const useTrade = (values: Input) => {
  const { step, setCancelAvailable } = values

  const { isEthereum } = useConfig()
  const { waitForTrade } = useOrderId()
  const [ orderId, setOrderId ] = useState<string | null>(null)
  const actions = useActions()

  const orderIdRef = useRef(orderId)
  orderIdRef.current = orderId

  const handleSetOrderId = useCallback((orderId: string | null) => {
    setOrderId(orderId)
    setCancelAvailable(Boolean(orderId))
  }, [ setCancelAvailable ])

  const handleTrade = useCallback(async (values: HandleTrade) => {
    const { orderId, setTransaction } = values

    if (!orderId) {
      return Promise.reject('Order ID is not defined')
    }

    handleSetOrderId(orderId)

    const blockExplorerUrl = isEthereum
      ? 'https://explorer.cow.fi/orders'
      : 'https://explorer.cow.fi/gc/orders'

    const hashUrl = `${blockExplorerUrl}/${orderId}`

    actions.ui.setBottomLoaderTransaction(hashUrl)

    setTransaction(step, Transactions.Status.Processing)

    const { hash: tradeHash, status, buyAmount } = await waitForTrade(orderId)

    const isCancelled = status === 'cancelled'

    if (!tradeHash || isCancelled) {
      return Promise.reject(isCancelled ? 'Order was cancelled' : 'TxHash is not defined')
    }

    setTransaction(step, Transactions.Status.Success)

    return {
      buyAmount: BigInt(buyAmount),
      hash: hashUrl,
    }
  }, [ step, actions, isEthereum, waitForTrade, handleSetOrderId ])

  return useMemo(() => ({
    orderIdRef,
    handleTrade,
    setOrderId: handleSetOrderId,
  }), [
    orderIdRef,
    handleTrade,
    handleSetOrderId,
  ])
}


export default useTrade
