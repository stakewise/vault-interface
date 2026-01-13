import { useCallback, useRef } from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'
import { ZeroAddress } from 'ethers'
import addresses from 'helpers/contracts/addresses'
import type { TradeParameters } from '@cowprotocol/cow-sdk'

import useTokens from './useTokens'
import useSwapSDK from './useSwapSDK'


type Input = {
  swapTokens: ReturnType<typeof useTokens>
}

type GetRateInput = {
  buyAmount: string
  sellAmount: string
  buyTokenDecimals: number
  sellTokenDecimals: number
}

type FetchQuoteInput = {
  buyAmount?: bigint
  sellAmount?: bigint
}

const useQuote = ({ swapTokens }: Input) => {
  const { address, chainId, isEthereum, isReadOnlyMode } = useConfig()

  const nativeTokenAddress = addresses[chainId].cow.nativeToken

  const getSwapSDK = useSwapSDK()

  const swapTokensRef = useRef(swapTokens)
  swapTokensRef.current = swapTokens

  const formatAmount = useCallback((amount: string, units: number) => {
    const amountMultiplier = 10n ** BigInt(18 - units)

    return BigInt(amount) * amountMultiplier
  }, [])

  const getRate = useCallback((values: GetRateInput) => {
    const { buyAmount, sellAmount, buyTokenDecimals, sellTokenDecimals } = values

    const formattedBuyAmount = formatAmount(buyAmount, buyTokenDecimals)
    const formattedSellAmount = formatAmount(sellAmount, sellTokenDecimals)

    return formattedBuyAmount * constants.blockchain.amount1 / formattedSellAmount
  }, [ formatAmount ])

  const getQuoteRequest = useCallback((values: FetchQuoteInput) => {
    const { buyAmount, sellAmount } = values

    const swapTokens = swapTokensRef.current

    const buyToken = swapTokens.buyToken.address || nativeTokenAddress
    const sellToken = swapTokens.sellToken.address || nativeTokenAddress
    const buyTokenDecimals = swapTokens.buyToken.units
    const sellTokenDecimals = swapTokens.sellToken.units
    const buyAmountString = buyAmount?.toString()
    const sellAmountString = sellAmount?.toString()

    return {
      buyToken,
      sellToken,
      buyTokenDecimals,
      sellTokenDecimals,
      kind: buyAmount ? 'buy' : 'sell',
      owner: address || ZeroAddress,
      amount: buyAmountString || sellAmountString,
      receiver: address || ZeroAddress,
      partiallyFillable: false,
    } as TradeParameters
  }, [ address, nativeTokenAddress ])

  return useCallback(async (values: FetchQuoteInput) => {
    const { tradingSdk } = await getSwapSDK()

    try {
      const quoteRequest = getQuoteRequest(values)

      const { quoteResults: { quoteResponse } } = await tradingSdk.getQuote(quoteRequest)

      const quote = {
        ...quoteResponse.quote,
        receiver: quoteRequest.receiver,
        buyAmount: quoteRequest.kind === 'buy' ? quoteRequest.amount : quoteResponse.quote.buyAmount,
        sellAmount: quoteRequest.kind === 'sell' ? quoteRequest.amount : quoteResponse.quote.sellAmount,
      }

      const rate = getRate({
        buyAmount: quote.buyAmount,
        sellAmount: quote.sellAmount,
        buyTokenDecimals: quoteRequest.buyTokenDecimals,
        sellTokenDecimals: quoteRequest.sellTokenDecimals,
      })

      return {
        rate,
        quote,
        quoteRequest,
      }
    }
    catch (error: any) {
      const feeAmount = error?.body?.data?.fee_amount

      if (feeAmount) {
        return Promise.reject({ feeAmount })
      }

      return Promise.reject(error)
    }
  }, [
    address, isEthereum, isReadOnlyMode, nativeTokenAddress,
    getRate, getSwapSDK, getQuoteRequest,
  ])
}


export default useQuote
