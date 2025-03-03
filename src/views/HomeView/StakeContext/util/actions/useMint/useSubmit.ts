import { useCallback } from 'react'
import { useActions, useBalances, useStore, useSubgraphUpdate } from 'hooks'
import { getters, commonMessages } from 'helpers'
import notifications from 'sw-modules/notifications'
import { AllocatorActionType } from 'sdk'
import { useConfig } from 'config'

import { Action, openTxCompletedModal } from 'layouts/modals'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useSubmit = (params: Vault.Params) => {
  const actions = useActions()
  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()

  return useCallback(async (shares: bigint) => {
    if (!address) {
      return
    }

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
}


export default useSubmit
