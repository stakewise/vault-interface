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

const useQuote = (values: Input) => {
  const { swapTokens } = values
  const { address, chainId } = useConfig()

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

  return useCallback(async (values: FetchQuoteInput) => {
    const { buyAmount, sellAmount } = values

    const { tradingSdk, kind } = await getSwapSDK()

    const buyToken = swapTokensRef.current.buyToken.address || nativeTokenAddress
    const sellToken = swapTokensRef.current.sellToken.address || nativeTokenAddress
    const buyTokenDecimals = swapTokensRef.current.buyToken.units
    const sellTokenDecimals = swapTokensRef.current.sellToken.units

    const buyAmountString = buyAmount?.toString()
    const sellAmountString = sellAmount?.toString()

    const quoteRequest = {
      buyToken,
      sellToken,
      buyTokenDecimals,
      sellTokenDecimals,
      kind: buyAmount ? kind.buy : kind.sell,
      owner: address || ZeroAddress,
      amount: buyAmountString || sellAmountString,
      receiver: address || ZeroAddress,
      partiallyFillable: false,
    } as TradeParameters

    try {
      const { quoteResults: { quoteResponse } } = await tradingSdk.getQuote(quoteRequest)

      const quote = {
        ...quoteResponse.quote,
        receiver: quoteRequest.receiver,
        buyAmount: buyAmountString || quoteResponse.quote.buyAmount,
        sellAmount: sellAmountString || quoteResponse.quote.sellAmount,
      }

      const rate = getRate({
        buyAmount: quote.buyAmount,
        sellAmount: quote.sellAmount,
        buyTokenDecimals,
        sellTokenDecimals,
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
  }, [ address, nativeTokenAddress, getRate, getSwapSDK ])
}


export default useQuote
