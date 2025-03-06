import { useCallback, useMemo, useState } from 'react'
import { useActions, useBalances, useStore, useSubgraphUpdate } from 'hooks'
import { getters, commonMessages } from 'helpers'
import notifications from 'sw-modules/notifications'
import { AllocatorActionType } from 'sdk'
import { useConfig } from 'config'

import { Action, openTxCompletedModal } from 'layouts/modals'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useSubmit = (params: StakePage.Params) => {
  const actions = useActions()
  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const [ isSubmitting, setSubmitting ] = useState(false)
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()

  const submit = useCallback(async (shares: bigint) => {
    if (!address) {
      return
    }

    setSubmitting(true)

    actions.ui.setBottomLoader({
      content: commonMessages.notification.waitingConfirmation,
    })

    try {
      const referrerAddress = getters.getReferrer()

      const hash = await signSDK.osToken.mint({
        userAddress: address,
        referrerAddress,
        vaultAddress,
        shares,
      })

      if (hash) {
        await subgraphUpdate({ hash })

        cancelOnChange({
          address,
          chainId,
          logic: () => {
            params.fetch.vault()
            params.userFetch.balances()

            refetchMintTokenBalance()
            refetchDepositTokenBalance()
          },
        })

        actions.vault.user.allocatorActions.addFirstItem({
          hash,
          shares,
          actionType: AllocatorActionType.OsTokenMinted,
          link: signSDK.config.network.blockExplorerUrl,
        })

        const tokens = [
          {
            token: signSDK.config.tokens.mintToken,
            action: Action.Mint,
            value: shares,
          },
        ]

        openTxCompletedModal({ tokens, hash })
      }

      setSubmitting(false)
    }
    catch (error) {
      setSubmitting(false)
      actions.ui.resetBottomLoader()
      console.error('Mint send transaction error', error as Error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })

      return Promise.reject(error)
    }
  }, [
    params,
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
