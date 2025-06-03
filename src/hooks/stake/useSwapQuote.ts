import { useCallback, useEffect, useMemo } from 'react'
import useObjectState from '../controls/useObjectState'

import useSwap from './useSwap'


type State = {
  fee: bigint
  buyAmount: bigint
  isFetching: boolean
}

type Input = {
  amount: bigint
  fromToken: string
}

const initialState = {
  fee: 0n,
  buyAmount: 0n,
  isFetching: false,
}

const useSwapQuote = ({ amount, fromToken }: Input) => {
  const skip = !fromToken || !amount

  const [ state, setState ] = useObjectState<State>({
    ...initialState,
    isFetching: !skip,
  })

  const { fetchQuote } = useSwap()

  const getBuyAmount = useCallback((value: bigint) => {
    if (amount && state.buyAmount) {
      const percent = value / (amount / 100n)

      return state.buyAmount / 100n * percent
    }

    return 0n
  }, [ amount, state.buyAmount ])

  const handleFetchQuote = useCallback(async ({ amount, fromToken }: Input) => {
    setState({ ...initialState, isFetching: true })

    let fee = '0'
    let buyAmount = '0'

    try {
      const quote = await fetchQuote({
        amount,
        fromToken,
      })

      fee = quote.feeAmount
      buyAmount = quote.buyAmount
    }
    catch (error: any) {
      if (error?.feeAmount) {
        fee = error.feeAmount as string
      }
    }

    setState({
      fee: BigInt(fee),
      buyAmount: BigInt(buyAmount),
      isFetching: false,
    })
  }, [ fetchQuote, setState ])

  useEffect(() => {
    if (skip) {
      setState(initialState)
    }
    else {
      handleFetchQuote({
        amount: amount as bigint,
        fromToken: fromToken,
      })
    }
  }, [ skip, amount, fromToken, handleFetchQuote, setState ])

  return useMemo(() => ({
    ...state,
    getBuyAmount,
  }), [
    state,
    getBuyAmount,
  ])
}


export default useSwapQuote
