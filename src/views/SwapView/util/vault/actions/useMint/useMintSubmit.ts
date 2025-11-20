import { useCallback, useState, useMemo } from 'react'
import { getters, commonMessages } from 'helpers'
import notifications from 'modules/notifications'
import { useConfig } from 'config'
import {
  useStore,
  useActions,
  useBalances,
  useSubgraphUpdate,
} from 'hooks'

import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'

import vaultHooks from '../../index'


type Input = {
  field: Forms.Field<bigint>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useMintSubmit = (values: Input) => {
  const { field, fetchAllUserData } = values

  const actions = useActions()
  const { vaultAddress } = useStore(storeSelector)
  const [ isSubmitting, setSubmitting ] = useState(false)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()

  const submit = useCallback(async () => {
    const shares = field.value

    if (!address || !shares) {
      return
    }

    actions.ui.setBottomLoader({
      content: commonMessages.notification.waitingConfirmation,
    })

    try {
      const referrerAddress = getters.getReferrer()

      const onSuccess = () => cancelOnChange({
        address,
        chainId,
        logic: () => {
          fetchAllUserData()
          refetchMintTokenBalance()
          refetchDepositTokenBalance()
        },
      })

      setSubmitting(true)

      const hash = await signSDK.osToken.mint({
        userAddress: address,
        referrerAddress,
        vaultAddress,
        shares,
      })

      if (hash) {
        await subgraphUpdate({ hash })
        await onSuccess()

        const tokens = [
          {
            token: signSDK.config.tokens.mintToken,
            action: Action.Mint,
            value: shares,
          },
        ]

        field.reset()
        openTxCompletedModal({ tokens, hash })
      }
    }
    catch (error) {
      actions.ui.resetBottomLoader()

      console.error('Mint send transaction error', error as Error)

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


export default useMintSubmit
