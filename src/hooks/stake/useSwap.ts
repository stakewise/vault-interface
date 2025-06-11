import { useCallback, useMemo, useRef } from 'react'
import { useConfig } from 'config'
import { ZeroAddress } from 'ethers'
import type { OrderCreation, OrderStatus, SupportedChainId, } from '@cowprotocol/cow-sdk'
import { StakeStep } from 'helpers/enums'

import { SetTransaction, Transactions, TransactionStatus } from 'components'

import useActions from '../data/useActions'
import useBalances from '../data/useBalances'


type FetchQuoteInput = {
  amount: bigint
  fromToken: string
}

type SwapInput = FetchQuoteInput & {
  setTransaction: SetTransaction
}

type CancelSwapInput = {
  setTransaction: SetTransaction
}

type SetNextStepsInput = {
  status: TransactionStatus
  setTransaction: SetTransaction
}

type WaitForTradeOutput = {
  hash?: string
  status?: OrderStatus
  buyToken: string
  sellToken: string
  buyAmount: string
  sellAmount: string
}

const useSwap = () => {
  const { signSDK, address, chainId, isMainnet } = useConfig()
  const { refetchDepositTokenBalance, refetchSwapTokenBalances } = useBalances()

  const actions = useActions()
  const orderIdRef = useRef('')

  const depositTokenAddress = isMainnet
    ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // this is the address of ETH in cow protocol
    : '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'

  const getCowSdk = useCallback(async () => {
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

  const fetchQuote = useCallback(async (values: FetchQuoteInput) => {
    const { amount, fromToken } = values

    const { orderBookApi, kind } = await getCowSdk()

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
  }, [ address, depositTokenAddress, getCowSdk ])

  const getSigner = useCallback(async (address: string) => {
    const signer = await signSDK.provider.getSigner(address)

    // Fix for error caused by different ethers versions: signer (v6) and cow sdk (v5)
    signer._signTypedData = signer.signTypedData

    return signer
  }, [ signSDK, address ])

  const sendOrder = useCallback(async (values: FetchQuoteInput) => {
    const { amount, fromToken } = values

    if (!address) {
      return {}
    }

    const { orderBookApi, signOrder } = await getCowSdk()

    const quote = await fetchQuote({ amount, fromToken })
    const signer = await getSigner(address)

    // Cow protocol requires the fee amount to be 0
    const orderParams = {
      feeAmount: '0',
      receiver: address,
      sellAmount: amount.toString(),
    }

    const unsignedOrder = {
      ...quote,
      ...orderParams,
    }

    const orderSigningResult = await signOrder(unsignedOrder, chainId as SupportedChainId, signer)

    const sendOrderInput = {
      ...quote,
      ...orderSigningResult,
      ...orderParams,
    } as unknown

    const orderId = await orderBookApi.sendOrder(sendOrderInput as OrderCreation)

    return {
      orderId,
      buyAmount: BigInt(quote.buyAmount),
    }
  }, [ chainId, getSigner, address, getCowSdk, fetchQuote ])

  const waitForTrade = useCallback(async (orderId: string): Promise<WaitForTradeOutput> => {
    try {
      const { orderBookApi } = await getCowSdk()

      const { status, buyAmount, sellAmount, sellToken, buyToken } = await orderBookApi.getOrder(orderId)
      const isFailed = [ 'expired', 'cancelled' ].includes(status)

      if (isFailed) {
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
  }, [ getCowSdk ])

  const setNextSteps = useCallback(({ status, setTransaction }: SetNextStepsInput) => {
    const nextSteps = [ StakeStep.Swap, StakeStep.Approve, StakeStep.Stake ]

    actions.ui.resetBottomLoader()

    nextSteps.forEach((step) => {
      setTransaction(step, status)
    })
  }, [])

  const swap = useCallback(async (values: SwapInput) => {
    const { amount, fromToken, setTransaction } = values

    try {
      setTransaction(StakeStep.Swap, Transactions.Status.Confirm)

      const { orderId } = await sendOrder({ amount, fromToken })

      if (!orderId) {
        setNextSteps({ status: Transactions.Status.Fail, setTransaction })

        return Promise.reject('Order ID is not defined')
      }

      orderIdRef.current = orderId

      const blockExplorerUrl = isMainnet
        ? 'https://explorer.cow.fi/orders'
        : 'https://explorer.cow.fi/gc/orders'

      actions.ui.setBottomLoaderTransaction(`${blockExplorerUrl}/${orderId}`)

      setTransaction(StakeStep.Swap, Transactions.Status.Processing)

      const { hash, status, buyAmount } = await waitForTrade(orderId)

      orderIdRef.current = ''

      if (status === 'cancelled') {
        setNextSteps({ status: Transactions.Status.Cancel, setTransaction })

        return Promise.reject('Order was cancelled')
      }
      else if (hash) {
        setTransaction(StakeStep.Swap, Transactions.Status.Success)
        refetchSwapTokenBalances()
        refetchDepositTokenBalance()
        actions.ui.resetBottomLoader()

        return BigInt(buyAmount)
      }
      else {
        setNextSteps({ status: Transactions.Status.Fail, setTransaction })

        return Promise.reject('TxHash is not defined')
      }
    }
    catch (error) {
      orderIdRef.current = ''
      setNextSteps({ status: Transactions.Status.Fail, setTransaction })

      return Promise.reject(error as string)
    }
  }, [
    actions,
    isMainnet,
    sendOrder,
    waitForTrade,
    refetchSwapTokenBalances,
    refetchDepositTokenBalance,
  ])

  const cancelSwap = useCallback(async ({ setTransaction }: CancelSwapInput) => {
    if (address && orderIdRef.current) {
      const { orderBookApi, signOrderCancellations } = await getCowSdk()

      setTransaction(StakeStep.Swap, Transactions.Status.Canceling)

      const signer = await getSigner(address)

      const orderUids = [ orderIdRef.current ]

      const orderCancellationsSigningResult = await signOrderCancellations(
        orderUids,
        chainId as SupportedChainId,
        signer
      )

      try {
        await orderBookApi.sendSignedOrderCancellations({
          ...orderCancellationsSigningResult,
          orderUids,
        })

        setTransaction(StakeStep.Swap, Transactions.Status.Cancel)
      }
      catch (error) {
        console.error(error)
        setTransaction(StakeStep.Swap, Transactions.Status.Success)
      }
    }
  }, [ address, getSigner, getCowSdk ])

  return useMemo(() => ({
    swap,
    cancelSwap,
    fetchQuote,
  }), [
    swap,
    cancelSwap,
    fetchQuote,
  ])
}


export default useSwap
