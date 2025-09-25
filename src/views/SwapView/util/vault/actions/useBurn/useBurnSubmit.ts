import { useCallback, useMemo, useState } from 'react'
import { useStore, useActions, useBalances, useSubgraphUpdate } from 'hooks'
import notifications from 'modules/notifications'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'

import vaultHooks from '../../index'


type Input = {
  field: Forms.Field<bigint>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})


const useBurnSubmit = (values: Input) => {
  const { field, fetchAllUserData } = values

  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const submit = useCallback(async () => {
    const shares = field.value

    if (!address || !shares) {
      return
    }

    actions.ui.setBottomLoader({
      content: commonMessages.notification.waitingConfirmation,
    })

    try {
      setSubmitting(true)

      const onSuccess = () => cancelOnChange({
        address,
        chainId,
        logic: () => {
          fetchAllUserData()
          refetchMintTokenBalance()
          refetchDepositTokenBalance()
        },
      })

      const hash = await signSDK.osToken.burn({
        userAddress: address,
        vaultAddress,
        shares,
      })

      if (hash) {
        await subgraphUpdate({ hash })
        await onSuccess()

        const tokens = [
          {
            value: shares,
            token: signSDK.config.tokens.mintToken,
            action: Action.Burn,
          },
        ]

        field.reset()
        openTxCompletedModal({ tokens, hash })
      }

      setSubmitting(false)
    }
    catch (error) {
      setSubmitting(false)
      actions.ui.resetBottomLoader()

      console.error('Burn send transaction error', error as Error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })

      return Promise.reject(error)
    }
    finally {
      setSubmitting(false)
    }
  }, [
    field,
    chainId,
    signSDK,
    address,
    actions,
    vaultAddress,
    subgraphUpdate,
    cancelOnChange,
    fetchAllUserData,
    refetchMintTokenBalance,
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


export default useBurnSubmit
