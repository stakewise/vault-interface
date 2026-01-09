import { useCallback, useMemo, useEffect, useRef } from 'react'
import { BigDecimal } from 'sdk'
import { useConfig } from 'config'
import { parseUnits } from 'ethers'
import { useObjectState } from 'hooks'

import useQuote from './useQuote'
import useTokens from './useTokens'


type Input = {
  swapTokens: ReturnType<typeof useTokens>
  skip?: boolean
}

const initialState = {
  swapFee: 0n,
  swappedDepositAmount: 0n,
  isSwapFeeFetching: false,
}

const useFee = (values: Input) => {
  const { swapTokens, skip: isSwapDisabled } = values

  const { address } = useConfig()

  const fetchQuote = useQuote({ swapTokens })

  const balance = address
    ? swapTokens.sellToken.balance
    : parseUnits('1', swapTokens.sellToken.units)

  const swapTokensRef = useRef(swapTokens)
  swapTokensRef.current = swapTokens

  const skip = !balance || isSwapDisabled

  const [ state, setState ] = useObjectState({
    ...initialState,
    isSwapFeeFetching: !skip,
  })

  const fetchBalanceQuote = useCallback(async () => {
    setState({ ...initialState, isSwapFeeFetching: true })

    let fee = '0'
    let buyAmount = '0'

    try {
      const { quote } = await fetchQuote({ sellAmount: balance })

      fee = quote.feeAmount
      buyAmount = quote.buyAmount
    }
    catch (error: any) {
      if (error?.feeAmount) {
        fee = error.feeAmount
      }
    }

    setState({
      swapFee: BigInt(fee),
      swappedDepositAmount: BigInt(buyAmount),
      isSwapFeeFetching: false,
    })
  }, [ balance, fetchQuote, setState ])

  const getSwappedDepositAmount = useCallback((value: bigint) => {
    // Swap fee is not fetched for depositTokens
    if (isSwapDisabled) {
      return value
    }

    if (balance && state.swappedDepositAmount) {
      const balancePercent = new BigDecimal(balance).divide(100)
      const percent = new BigDecimal(value).divide(balancePercent)

      const result = new BigDecimal(state.swappedDepositAmount)
        .divide(100)
        .multiply(percent)
        .decimals(0)
        .toNumber()

      return BigInt(result)
    }

    return 0n
  }, [ balance, state.swappedDepositAmount, isSwapDisabled ])

  useEffect(() => {
    if (skip) {
      setState(initialState)
    }
    else {
      fetchBalanceQuote()
    }
  }, [ skip, fetchBalanceQuote, setState ])

  return useMemo(() => ({
    ...state,
    getSwappedDepositAmount,
  }), [
    state,
    getSwappedDepositAmount,
  ])
}


export default useFee
