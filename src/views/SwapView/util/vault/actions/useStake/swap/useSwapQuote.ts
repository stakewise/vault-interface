import { useCallback, useMemo, useEffect } from 'react'
import { ZeroAddress, parseUnits } from 'ethers'
import { useObjectState } from 'hooks'
import { useConfig } from 'config'
import { BigDecimal } from 'sdk'

import useSwapSDK from './useSwapSDK'
import useSwapTokens from './useSwapTokens'


type Input = {
  swapTokens: ReturnType<typeof useSwapTokens>
}

type FetchQuoteInput = {
  amount: bigint
  fromToken: string
}

const initialState = {
  swapFee: 0n,
  swappedDepositAmount: 0n,
  isSwapQuoteFetching: false,
}

const useSwap = (values: Input) => {
  const { swapTokens } = values

  const getSwapSDK = useSwapSDK()
  const { address, isMainnet } = useConfig()

  const balance = address
    ? swapTokens.selected.balance
    : parseUnits('1', swapTokens.selected.units)

  const tokenAddress = swapTokens.selected.address

  const skip = !tokenAddress || !balance

  const [ state, setState ] = useObjectState({
    ...initialState,
    isSwapQuoteFetching: !skip,
  })

  const depositTokenAddress = isMainnet
    ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // this is the address of ETH in cow protocol
    : '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'

  const fetchQuote = useCallback(async (values: FetchQuoteInput) => {
    const { amount, fromToken } = values

    const { orderBookApi, kind } = await getSwapSDK()

    const quoteRequest = {
      from: address || ZeroAddress,
      receiver: address || ZeroAddress,
      buyToken: depositTokenAddress,
      sellToken: fromToken,
      sellAmountBeforeFee: amount.toString(),
      kind,
    }

    try {
      const { quote } = await orderBookApi.getQuote(quoteRequest)

      return quote
    }
    catch (error: any) {
      if (error?.body?.data?.fee_amount) {
        return Promise.reject({
          feeAmount: error?.body?.data?.fee_amount,
        })
      }

      return Promise.reject(error)
    }
  }, [ address, depositTokenAddress, getSwapSDK ])

  const fetchBalanceQuote = useCallback(async () => {
    setState({ ...initialState, isSwapQuoteFetching: true })

    let fee = '0'
    let buyAmount = '0'

    try {
      if (tokenAddress) {
        const quote = await fetchQuote({
          fromToken: tokenAddress,
          amount: balance,
        })

        fee = quote.feeAmount
        buyAmount = quote.buyAmount
      }
    }
    catch (error: any) {
      if (error?.feeAmount) {
        fee = error.feeAmount as string
      }
    }

    setState({
      swapFee: BigInt(fee),
      swappedDepositAmount: BigInt(buyAmount),
      isSwapQuoteFetching: false,
    })
  }, [ balance, tokenAddress, fetchQuote, setState ])

  const getSwappedDepositAmount = useCallback((value: bigint) => {
    if (!tokenAddress) {
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
  }, [ balance, tokenAddress, state.swappedDepositAmount ])

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
    fetchQuote,
    getSwappedDepositAmount,
  }), [
    state,
    fetchQuote,
    getSwappedDepositAmount,
  ])
}


export default useSwap
