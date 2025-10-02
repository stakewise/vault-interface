import { useCallback, useMemo, useRef } from 'react'
import type { OrderCreation, OrderStatus, SupportedChainId } from '@cowprotocol/cow-sdk'
import { useActions, useBalances } from 'hooks'
import { StakeStep } from 'helpers/enums'
import { useConfig } from 'config'

import { Transactions } from 'components'
import type { SetTransaction, TransactionStatus } from 'components'

import useSwapSDK from './useSwapSDK'
import useSwapQuote from './useSwapQuote'
import useSwapTokens from './useSwapTokens'


type Input = {
  field: Forms.Field<bigint>
  swapTokens: ReturnType<typeof useSwapTokens>
  fetchQuote: ReturnType<typeof useSwapQuote>['fetchQuote']
}

type FetchQuoteInput = {
  amount: bigint
  fromToken: string
}

type SwapInput = {
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

const useSwapActions = (values: Input) => {
  const { field, swapTokens, fetchQuote } = values

  const { signSDK, address, chainId, isMainnet } = useConfig()
  const { refetchDepositTokenBalance, refetchSwapTokenBalances } = useBalances()

  const actions = useActions()
  const orderIdRef = useRef('')
  const getSwapSDK = useSwapSDK()

  const getSigner = useCallback(async (address: string) => {
    const signer = await signSDK.provider.getSigner(address)

    // Fix for error caused by different ethers versions: signer (v6) and cow sdk (v5)
    signer._signTypedData = signer.signTypedData

    return signer
  }, [ signSDK ])

  const sendOrder = useCallback(async (values: FetchQuoteInput) => {
    const { amount, fromToken } = values

    if (!address) {
      return {}
    }

    const { orderBookApi, signOrder } = await getSwapSDK()

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
  }, [ chainId, getSigner, address, getSwapSDK, fetchQuote ])

  const waitForTrade = useCallback(async (orderId: string): Promise<WaitForTradeOutput> => {
    try {
      const { orderBookApi } = await getSwapSDK()

      const { status, buyAmount, sellAmount, sellToken, buyToken } = await orderBookApi.getOrder(orderId)
      const isFailed = [ 'expired', 'cancelled' ].includes(status)

      if (isFailed) {
        console.error('Swap failed', {
          orderId,
          status,
          sellToken,
          sellAmount,
        })

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

  const setNextSteps = useCallback(({ status, setTransaction }: SetNextStepsInput) => {
    const nextSteps = [ StakeStep.Swap, StakeStep.Approve, StakeStep.Stake ]

    actions.ui.resetBottomLoader()

    nextSteps.forEach((step) => {
      setTransaction(step, status)
    })
  }, [ actions ])

  const swap = useCallback(async (values: SwapInput) => {
    const { setTransaction } = values

    const assets = field.value

    if (!swapTokens.selected.address || !assets) {
      return 0n
    }

    try {
      setTransaction(StakeStep.Swap, Transactions.Status.Confirm)

      const { orderId } = await sendOrder({
        fromToken: swapTokens.selected.address,
        amount: assets,
      })

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
        const resultAmount = BigInt(buyAmount)

        setTransaction(StakeStep.Swap, Transactions.Status.Success)
        refetchSwapTokenBalances()
        refetchDepositTokenBalance()
        actions.ui.resetBottomLoader()

        if (assets !== resultAmount) {
          swapTokens.setSelected('')
          field.setValue(assets)
        }

        return resultAmount
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
    field,
    actions,
    isMainnet,
    sendOrder,
    swapTokens,
    waitForTrade,
    setNextSteps,
    refetchSwapTokenBalances,
    refetchDepositTokenBalance,
  ])

  const cancelSwap = useCallback(async ({ setTransaction }: CancelSwapInput) => {
    if (address && orderIdRef.current) {
      const { orderBookApi, signOrderCancellations } = await getSwapSDK()

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
  }, [ address, chainId, getSigner, getSwapSDK ])

  return useMemo(() => ({
    swap,
    cancelSwap,
  }), [
    swap,
    cancelSwap,
  ])
}


export default useSwapActions
