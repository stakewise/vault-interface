import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'
import notifications from 'modules/notifications'
import { commonMessages, getters } from 'helpers'

import type { SetTransaction, StepsData } from '../../components/Transactions/types'
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
    flow: 'stake'
    stepsData?: StepsData
    onStart: (values: { setTransaction: SetTransaction }) => Promise<void>
  }) => void
}

const useStakeSubmit = ({ field, swapToken, stakeStep, onSwap, onSuccess, openTransactionsFlowModal }: Input) => {
  const actions = useActions()
  const { swap, cancelSwap } = useSwap()
  const { vaultAddress } = useStore(storeSelector)
  const [ isSubmitting, setSubmitting ] = useState(false)
  const { sdk, signSDK, address, chainId, cancelOnChange } = useConfig()

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
    field,
    chainId,
    address,
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

      setTransaction(StakeStep.Stake, Transactions.Status.Processing)

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

  const stepsData = useMemo(() => {
    const result: StepsData = []

    if (swapApprove.isRequired) {
      result.push({
        id: StakeStep.SwapApprove,
        title: {
          ...commonMessages.buttonTitle.approve,
          values: {
            token: swapToken.name,
          },
        },
      })
    }

    if (swapToken.address) {
      result.push({
        id: StakeStep.Swap,
        onCancel: cancelSwap,
      })
    }

    if (stakeApprove.isRequired) {
      result.push({
        id: StakeStep.Approve,
        title: {
          ...commonMessages.buttonTitle.approve,
          values: {
            token: sdk.config.tokens.depositToken,
          },
        },
      })
    }

    result.push({ id: stakeStep })

    return result
  }, [ sdk, stakeStep, swapToken, swapApprove, stakeApprove ])

  const onStart = useCallback(async (values: OnStartInput) => {
    const { assets, closeModal, setTransaction = () => {} } = values

    setSubmitting(true)

    try {
      let stakeAssets = assets

      for (let i = 0; i < stepsData.length; i += 1) {
        const step = stepsData[i]

        if (step.id === StakeStep.SwapApprove) {
          await swapApprove.approve({ setTransaction })
        }

        if (step.id === StakeStep.Swap) {
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

        if (step.id === StakeStep.Approve) {
          await stakeApprove.approve({ setTransaction })
        }

        if (step.id === StakeStep.Stake) {
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
  }, [ actions, swapToken, stepsData, swapApprove, stakeApprove, swap, stake, onSwap ])

  const submit = useCallback((values?: SubmitInput) => {
    const { closeModal = () => {} } = values || {}

    const assets = field.value

    if (!address || !assets || !vaultAddress) {
      return
    }

    if (stepsData.length > 1) {
      openTransactionsFlowModal({
        flow: 'stake',
        stepsData,
        onStart: ({ setTransaction }) => onStart({ assets, closeModal, setTransaction }),
      })
    }
    else {
      onStart({ assets, closeModal })
    }
  }, [ field, address, vaultAddress, stepsData, onStart, openTransactionsFlowModal ])

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
