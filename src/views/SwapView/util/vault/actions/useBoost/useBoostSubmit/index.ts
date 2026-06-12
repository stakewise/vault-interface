import { useCallback, useMemo, useState } from 'react'
import notifications from 'modules/notifications'
import { useStore, useActions } from 'hooks'
import { BoostStep } from 'helpers/enums'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import type { SetTransaction } from 'components/Transactions/types'
import { openTransactionsFlowModal } from 'layouts/modals'

import vaultHooks from '../../../index'

import useBoostSteps from './useBoostSteps'
import useBoostActions from './useBoostActions'
import useBoostAllowance from '../useBoostAllowance'


type OnStartInput = {
  amount: bigint
  permitAddress?: string
  setTransaction?: SetTransaction
}

type Input = {
  vaultAddress: string
  field:  Forms.Field<bigint>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

type Output = {
  allowance: bigint
  isSubmitting: boolean
  isAllowanceFetching: boolean
  submit: () => void
}

const storeSelector = (store: Store) => ({
  leverageStrategyData: store.vault.user.balances.boost.leverageStrategyData,
})

const useBoostSubmit = (values: Input): Output => {
  const { vaultAddress, field, fetchAllUserData } = values

  const actions = useActions()
  const { address } = useConfig()

  const { leverageStrategyData } = useStore(storeSelector)
  const [ isSubmitting, setSubmitting ] = useState(false)

  const {
    allowance,
    permitAddress,
    isFetching,
    approve,
    checkAllowance,
  } = useBoostAllowance(vaultAddress)

  const getStepsData = useBoostSteps({
    allowance,
    permitAddress,
  })

  const {
    boost,
    upgrade,
    onSuccess,
    refetchData,
    approveOrPermit,
  } = useBoostActions({
    field,
    allowance,
    vaultAddress,
    permitAddress,
    approve,
    checkAllowance,
    fetchAllUserData,
  })

  const onStart = useCallback(async (values: OnStartInput) => {
    const { amount, setTransaction = () => {} } = values

    try {
      if (!amount || !address || !vaultAddress) {
        return
      }

      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      setSubmitting(true)

      let hash
      let permitParams
      let _leverageStrategyData = leverageStrategyData

      const stepsData = getStepsData(amount)

      for (let i = 0; i < stepsData.length; i += 1) {
        const step = stepsData[i]

        if (step.id === BoostStep.Upgrade) {
          await upgrade({
            userAddress: address,
            vaultAddress,
            setTransaction,
          })

          _leverageStrategyData = {
            version: 2,
            isUpgradeRequired: false,
          }
        }
        if (step.id === BoostStep.Permit) {
          permitParams = await approveOrPermit({
            amount,
            userAddress: address,
            vaultAddress,
            setTransaction,
          })
        }
        if (step.id === BoostStep.Boost) {
          hash = await boost({
            amount,
            permitParams,
            vaultAddress,
            leverageStrategyData: _leverageStrategyData,
            userAddress: address,
            setTransaction,
          })
        }
      }

      if (hash) {
        await onSuccess({
          hash,
          amount,
          permitParams,
        })
      }
    }
    catch (error: any) {
      actions.ui.resetBottomLoader()

      console.error('Boost send transaction error', error as Error)

      notifications.open({
        type: error.isCancel ? 'info' : 'error',
        text: error.isCancel ? commonMessages.notification.cancelled : commonMessages.notification.failed,
      })

      return Promise.reject(error)
    }
    finally {
      refetchData()
      setSubmitting(false)
    }
  }, [
    actions,
    address,
    vaultAddress,
    boost,
    upgrade,
    onSuccess,
    refetchData,
    getStepsData,
    approveOrPermit,
    leverageStrategyData,
  ])

  const submit = useCallback(() => {
    const amount = field.value || 0n

    if (!amount || !address || !vaultAddress) {
      return
    }

    const stepsData = getStepsData(amount)

    if (stepsData.length > 1) {
      openTransactionsFlowModal({
        flow: 'boost',
        stepsData,
        onStart: ({ setTransaction }) => onStart({ amount, setTransaction }),
      })
    }
    else {
      onStart({ amount })
    }
  }, [
    field,
    address,
    vaultAddress,
    getStepsData,
    onStart,
  ])

  return useMemo(() => ({
    allowance,
    isSubmitting,
    isAllowanceFetching: isFetching,
    submit,
  }), [
    allowance,
    isFetching,
    isSubmitting,
    submit,
  ])
}


export default useBoostSubmit
