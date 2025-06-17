import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { AllocatorActionType } from 'sdk'
import { commonMessages } from 'helpers'
import notifications from 'modules/notifications'
import { useBalances, useActions, useStore, useSubgraphUpdate } from 'hooks'

import { Action, openTxCompletedModal } from 'layouts/modals'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useSubmit = (params: StakePage.Params) => {
  const { field, fetch } = params

  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const submit = useCallback(async () => {
    const shares = field.value || 0n

    if (!address || !shares) {
      return
    }

    setSubmitting(true)

    actions.ui.setBottomLoader({
      content: commonMessages.notification.waitingConfirmation,
    })

    try {
      const hash = await signSDK.osToken.burn({
        userAddress: address,
        vaultAddress,
        shares,
      })

      if (hash) {
        await subgraphUpdate({ hash })

        field.reset()

        cancelOnChange({
          address,
          chainId,
          logic: () => {
            fetch.data()
            fetch.balances()

            refetchMintTokenBalance()
            refetchDepositTokenBalance()
          },
        })

        const blockExplorerUrl = signSDK.config.network.blockExplorerUrl

        actions.vault.user.allocatorActions.addFirstItem({
          hash,
          shares,
          actionType: AllocatorActionType.OsTokenBurned,
          link: blockExplorerUrl,
        })

        const tokens = [
          {
            value: shares,
            token: signSDK.config.tokens.mintToken,
            action: Action.Burn,
          },
        ]

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
  }, [
    field,
    fetch,
    chainId,
    signSDK,
    address,
    actions,
    vaultAddress,
    subgraphUpdate,
    cancelOnChange,
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


export default useSubmit
