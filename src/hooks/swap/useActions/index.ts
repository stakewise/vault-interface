import { useRef, useMemo, useState, useCallback } from 'react'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'

import Transactions from 'components/Transactions/Transactions'
import type { SetTransaction } from 'components/Transactions/types'

import useActions from '../../data/useActions'
import useBalances from '../../data/useBalances'

import useQuote from '../useQuote'
import useErc20Flow from './useErc20Flow'


type Input = {
  fetchQuote: ReturnType<typeof useQuote>
}

type SendOrderInput = {
  buyAmount?: bigint
  sellAmount?: bigint
}

type CancelSwapInput = {
  setTransaction: SetTransaction
}

type SwapInput = SendOrderInput & CancelSwapInput

const step = StakeStep.Swap

const useSwapActions = (values: Input) => {
  const { fetchQuote } = values

  const { address } = useConfig()
  const actions = useActions()
  const { refetchDepositTokenBalance, refetchSwapTokenBalances } = useBalances()

  const [ isCancelling, setCancelling ] = useState(false)
  const [ isCancelAvailable, setCancelAvailable ] = useState(false)

  const stateRef = useRef({ isCancelAvailable })
  stateRef.current = { isCancelAvailable }

  const erc20Flow = useErc20Flow({ step, setCancelAvailable })

  const swap = useCallback(async (values: SwapInput) => {
    const { setTransaction, ...rest } = values

    try {
      if (!address || (!rest.sellAmount && !rest.buyAmount)) {
        return Promise.reject('No swap amount defined')
      }

      setTransaction(step, Transactions.Status.Confirm)

      const { quoteRequest } = await fetchQuote(values)

      const result = await erc20Flow.sendOrder({ quoteRequest, setTransaction })

      refetchSwapTokenBalances()
      refetchDepositTokenBalance()

      return result
    }
    catch (error) {
      const status = error === 'Order was cancelled'
        ? Transactions.Status.Cancel
        : Transactions.Status.Fail

      setTransaction(step, status, true)

      return Promise.reject(error as string)
    }
    finally {
      setCancelAvailable(false)
      actions.ui.resetBottomLoader()
    }
  }, [
    address,
    actions,
    erc20Flow,
    fetchQuote,
    refetchSwapTokenBalances,
    refetchDepositTokenBalance,
  ])

  const cancelSwap = useCallback(({ setTransaction }: CancelSwapInput) => {
    const { isCancelAvailable } = stateRef.current

    if (isCancelAvailable) {
      const data = { setCancelling, setTransaction }

      return erc20Flow.cancelOrder(data)
    }
  }, [ erc20Flow ])

  return useMemo(() => ({
    isCancelling,
    isCancelAvailable,
    swap,
    cancelSwap,
  }), [
    isCancelling,
    isCancelAvailable,
    swap,
    cancelSwap,
  ])
}


export default useSwapActions
