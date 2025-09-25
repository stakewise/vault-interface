import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'
import notifications from 'modules/notifications'
import { useStore, useActions, useBalances, useSubgraphUpdate } from 'hooks'

import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'

import vaultHooks from '../../index'


type Input = {
  field: Forms.Field<bigint>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  isCollateralized: store.vault.base.data.isCollateralized,
})

const useUnstakeSubmit = (values: Input) => {
  const { field, fetchAllUserData } = values

  const actions = useActions()
  const [ isSubmitting, setSubmitting ] = useState(false)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()
  const { vaultAddress, isCollateralized } = useStore(storeSelector)

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance } = useBalances()

  const submit = useCallback(async () => {
    const assets = field.value || 0n

    if (!address || !assets) {
      return
    }

    try {
      setSubmitting(true)

      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      const onSuccess = () => cancelOnChange({
        address,
        chainId,
        logic: () => {
          fetchAllUserData()
          refetchDepositTokenBalance()
        },
      })

      const hash = await signSDK.vault.withdraw({
        userAddress: address,
        vaultAddress,
        assets,
      })

      if (hash) {
        await subgraphUpdate({ hash })
        await onSuccess()

        const tokens = [
          {
            action: isCollateralized ? Action.ExitQueue : Action.Redeemed,
            token: signSDK.config.tokens.depositToken,
            value: assets,
          },
        ]

        openTxCompletedModal({ tokens, hash })
      }
    }
    catch (error) {
      actions.ui.resetBottomLoader()

      console.error('Unstake send transaction error', error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })
    }
    finally {
      setSubmitting(false)
    }
  }, [
    field,
    chainId,
    signSDK,
    actions,
    address,
    vaultAddress,
    isCollateralized,
    subgraphUpdate,
    cancelOnChange,
    fetchAllUserData,
    refetchDepositTokenBalance,
  ])

  return useMemo(() => ({
    isSubmitting,
    submit,
  }), [
    isSubmitting,
    submit,
  ])
}


export default useUnstakeSubmit
