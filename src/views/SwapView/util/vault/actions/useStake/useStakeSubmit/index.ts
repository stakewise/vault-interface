import { useCallback, useMemo, useState } from 'react'
import addresses from 'helpers/contracts/addresses'
import notifications from 'modules/notifications'
import { useStore, useActions, swapHooks } from 'hooks'
import { StakeStep } from 'helpers/enums'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { vaultHooks } from 'views/SwapView/util'
import type { SetTransaction } from 'components/Transactions/types'
import { openTransactionsFlowModal } from 'layouts/modals/TransactionsFlowModal/TransactionsFlowModal'

import useStakeSteps from './useStakeSteps'
import useStakeActions from './useStakeActions'
import useStakeApprove from './useStakeApprove'
import useStakeTransactionPrice from './useStakeTransactionPrice'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

type OnStartInput = {
  setTransaction?: SetTransaction
}

type SwapActions = Pick<ReturnType<typeof swapHooks.useActions>, 'swap' | 'cancelSwap'>

type Input = SwapActions & {
  field: Forms.Field<bigint>
  swapTokens: ReturnType<typeof swapHooks.useTokens>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const useStakeSubmit = (values: Input) => {
  const { field, swapTokens, swap, cancelSwap, fetchAllUserData } = values

  const actions = useActions()
  const { vaultAddress } = useStore(storeSelector)
  const { sdk, address, chainId, isGnosis } = useConfig()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const { stake } = useStakeActions({ field, fetchAllUserData })

  const swapApprove = useStakeApprove({
    field,
    step: StakeStep.SwapApprove,
    recipient: addresses[chainId].cow.vaultRelayer,
    tokenAddress: swapTokens.sellToken.address,
    skip: !swapTokens.sellToken.address || !vaultAddress || !swapTokens.sellToken.address,
  })

  const stakeApprove = useStakeApprove({
    field,
    step: StakeStep.Approve,
    recipient: vaultAddress as string,
    tokenAddress: sdk.config.addresses.tokens.depositToken,
    skip: !isGnosis || !vaultAddress,
  })

  const stepsData = useStakeSteps({
    isStakeApproveRequired: stakeApprove.isApproveRequired,
    isSwapApproveRequired: swapApprove.isApproveRequired,
    swapTokens,
    cancelSwap,
  })

  const onStart = useCallback(async (values?: OnStartInput) => {
    const { setTransaction = () => {} } = values || {}

    let assets = field.value || 0n

    if (!address || !assets || !vaultAddress) {
      return
    }

    setSubmitting(true)

    const calls = {
      [StakeStep.Swap]: async () => {
        const result = await swap({ sellAmount: assets, setTransaction })

        assets = result.buyAmount

        swapTokens.reset()
        field.setValue(assets)
      },
      [StakeStep.Stake]: (assets: bigint) => stake({ assets, setTransaction }),
      [StakeStep.Approve]: () => stakeApprove.approve({ setTransaction }),
      [StakeStep.SwapApprove]: () => swapApprove.approve({ setTransaction }),
    } as const

    try {
      for (let i = 0; i < stepsData.length; i += 1) {
        const step = stepsData[i]

        const call = calls[step.id as keyof typeof calls]

        await call(assets)
      }
    }
    catch (error: any) {
      actions.ui.resetBottomLoader()

      console.error('Deposit send transaction error', error)

      notifications.open({
        type: error.isCancel ? 'info' : 'error',
        text: error.isCancel ? commonMessages.notification.cancelled : commonMessages.notification.failed,
      })
    }
    finally {
      field.reset()
      setSubmitting(false)
    }
  }, [
    field,
    actions,
    address,
    stepsData,
    swapTokens,
    swapApprove,
    stakeApprove,
    vaultAddress,
    swap,
    stake,
  ])

  const submit = useCallback(() => {
    if (stepsData.length > 1) {
      openTransactionsFlowModal({
        flow: 'stake',
        stepsData,
        onStart,
      })
    }
    else {
      onStart()
    }
  }, [ stepsData, onStart ])

  const transactionPrice = useStakeTransactionPrice({ swapApprove, stakeApprove, stepsData })

  const isAllowanceFetching = swapApprove.isAllowanceFetching || stakeApprove.isAllowanceFetching

  return useMemo(() => ({
    isSubmitting,
    transactionPrice,
    isAllowanceFetching,
    submit,
  }), [
    isSubmitting,
    transactionPrice,
    isAllowanceFetching,
    submit,
  ])
}


export default useStakeSubmit
