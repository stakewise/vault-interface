import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'
import notifications from 'modules/notifications'
import { commonMessages, getters } from 'helpers'

import type { SetTransaction } from '../../components/Transactions/types'
import Transactions from '../../components/Transactions/Transactions'

import useStore from '../data/useStore'
import useActions from '../data/useActions'
import useBalances from '../data/useBalances'
import useSubgraphUpdate from '../fetch/useSubgraphUpdate'

import useSwap from './useSwap'
import useStakeApproveGas from './useStakeApproveGas'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

type SubmitInput = {
  closeModal: () => void
}

type OnSuccessInput = {
  assets?: bigint
  shares?: bigint
  hash: string
}

type StakeInput = SubmitInput & {
  assets: bigint
  setTransaction: SetTransaction
}

type OnStartInput = SubmitInput & {
  assets: bigint
  setTransaction?: SetTransaction
}

type Input = {
  field: Forms.Field<bigint>
  swapToken: SwapToken
  stakeStep: StakeStep.Stake
  onSwap?: (buyAmount: bigint) => void
  onSuccess?: (values: OnSuccessInput) => void
  openTransactionsFlowModal: (props: {
    flow: string
    stepTitles: Record<string, Intl.Message>
    availableSteps: string[]
    onStart: (values: { setTransaction: SetTransaction }) => Promise<void>
  }) => void
}

const useStakeSubmit = ({ field, swapToken, stakeStep, onSwap, onSuccess, openTransactionsFlowModal }: Input) => {
  const { swap } = useSwap()
  const actions = useActions()
  const { vaultAddress } = useStore(storeSelector)
  const [ isSubmitting, setSubmitting ] = useState(false)
  const { sdk, signSDK, address, chainId, isGnosis, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchNativeTokenBalance, refetchDepositTokenBalance } = useBalances()
  const { approveGas, swapApprove, stakeApprove } = useStakeApproveGas({
    field,
    swapToken,
    vaultAddress,
  })

  const handleSuccess = useCallback((values: OnSuccessInput) => {
    field.reset()

    cancelOnChange({
      address,
      chainId,
      logic: () => {
        refetchNativeTokenBalance()
        refetchDepositTokenBalance()

        if (typeof onSuccess === 'function') {
          onSuccess(values)
        }
      },
    })
  }, [
    sdk,
    chainId,
    address,
    actions,
    vaultAddress,
    onSuccess,
    cancelOnChange,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  const stake = useCallback(async (values: StakeInput) => {
    const { assets, closeModal, setTransaction } = values

    try {
      setTransaction(StakeStep.Stake, Transactions.Status.Confirm)

      const referrerAddress = getters.getReferrer()

      const hash = await signSDK.vault.deposit({
        userAddress: address as string,
        assets,
        vaultAddress,
        referrerAddress,
      })

      setTransaction(StakeStep.Stake, Transactions.Status.Waiting)

      if (hash) {
        await subgraphUpdate({ hash })

        setTransaction(StakeStep.Stake, Transactions.Status.Success)

        closeModal()

        handleSuccess({ hash, assets })
      }
      else {
        setTransaction(StakeStep.Stake, Transactions.Status.Fail)

        return Promise.reject('TxHash is not defined')
      }
    }
    catch (error) {
      setTransaction(StakeStep.Stake, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [ signSDK, address, vaultAddress, subgraphUpdate, handleSuccess ])

  const { availableSteps, stepTitles } = useMemo(() => {
    const availableSteps = []
    const stepTitles: Record<string, Intl.Message> = {}

    if (swapApprove.isRequired) {
      availableSteps.push(StakeStep.SwapApprove)
      stepTitles[StakeStep.SwapApprove] = {
        ...commonMessages.buttonTitle.approve,
        values: {
          token: swapToken.name,
        },
      }
    }

    if (swapToken.address) {
      availableSteps.push(StakeStep.Swap)
    }

    if (stakeApprove.isRequired) {
      availableSteps.push(StakeStep.Approve)
      stepTitles[StakeStep.Approve] = {
        ...commonMessages.buttonTitle.approve,
        values: {
          token: sdk.config.tokens.depositToken,
        },
      }
    }

    availableSteps.push(stakeStep)

    return {
      availableSteps,
      stepTitles,
    }
  }, [ sdk, stakeStep, swapToken, swapApprove, stakeApprove ])

  const onStart = useCallback(async (values: OnStartInput) => {
    const { assets, closeModal, setTransaction = () => {} } = values

    setSubmitting(true)

    try {
      let stakeAssets = assets

      for (let i = 0; i < availableSteps.length; i += 1) {
        const step = availableSteps[i]

        if (step === StakeStep.SwapApprove) {
          await swapApprove.approve({ setTransaction })
        }

        if (step === StakeStep.Swap) {
          const buyAmount = await swap({
            amount: assets,
            fromToken: swapToken.address,
            setTransaction,
          })

          if (buyAmount) {
            stakeAssets = buyAmount

            if (typeof onSwap === 'function') {
              onSwap(buyAmount)
            }
          }
        }

        if (step === StakeStep.Approve) {
          await stakeApprove.approve({ setTransaction })
        }

        if (step === StakeStep.Stake) {
          await stake({ assets: stakeAssets, closeModal, setTransaction })
        }
      }
    }
    catch (error) {
      actions.ui.resetBottomLoader()
      console.error('Deposit send transaction error', error as Error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })
    }
    finally {
      setSubmitting(false)
    }
  }, [ field, actions, swapToken, availableSteps, swapApprove, stakeApprove, swap, stake, onSwap ])

  const submit = useCallback(async (values?: SubmitInput) => {
    const { closeModal = () => {} } = values || {}

    const assets = field.value

    if (!address || !assets || !vaultAddress) {
      return
    }

    console.log({
      category: 'action',
      message: 'Stake',
    })

    if (availableSteps.length > 1) {
      openTransactionsFlowModal({
        flow: 'stake',
        stepTitles,
        availableSteps,
        onStart: ({ setTransaction }) => onStart({ assets, closeModal, setTransaction }),
      })
    }
    else {
      onStart({ assets, closeModal, openTransactionsFlowModal })
    }
  }, [ field, address, vaultAddress, stepTitles, availableSteps, onStart ])

  const isAllowanceFetching = swapApprove.isFetching || stakeApprove.isFetching

  return useMemo(() => ({
    approveGas,
    isSubmitting,
    isAllowanceFetching,
    submit,
  }), [
    approveGas,
    isSubmitting,
    isAllowanceFetching,
    submit,
  ])
}


export default useStakeSubmit
