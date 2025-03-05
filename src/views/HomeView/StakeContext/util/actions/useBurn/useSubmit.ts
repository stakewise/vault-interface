import { useCallback } from 'react'
import { useConfig } from 'config'
import { AllocatorActionType } from 'sdk'
import { commonMessages } from 'helpers'
import notifications from 'sw-modules/notifications'
import { useBalances, useActions, useStore, useSubgraphUpdate } from 'hooks'

import { Action, openTxCompletedModal } from 'layouts/modals'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useSubmit = (params: StakePage.Params) => {
  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()

  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  return useCallback(async (shares: bigint) => {
    if (!address) {
      return
    }

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
    }
    catch (error) {
      actions.ui.resetBottomLoader()
      console.error('Burn send transaction error', error as Error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })

      return Promise.reject(error)
    }
  }, [
    chainId,
    signSDK,
    address,
    actions,
    params,
    vaultAddress,
    subgraphUpdate,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchDepositTokenBalance,
  ])
}


export default useSubmit
