import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { AllocatorActionType } from 'sdk'
import { commonMessages } from 'helpers'
import notifications from 'modules/notifications'
import { useActions, useBalances, useStore, useSubgraphUpdate } from 'hooks'

import { Action, openTxCompletedModal } from 'layouts/modals'


type Output = {
  isSubmitting: boolean
  submit: () => Promise<void>
}

const storeSelector = (store: Store) => ({
  isCollateralized: store.vault.base.data.isCollateralized,
})

const useSubmit = (params: StakePage.Params): Output => {
  const { field, vaultAddress, fetch } = params

  const actions = useActions()
  const { signSDK, address, chainId, cancelOnChange } = useConfig()
  const { isCollateralized } = useStore(storeSelector)
  const [ isSubmitting, setSubmitting ] = useState(false)

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchNativeTokenBalance, refetchDepositTokenBalance } = useBalances()

  const submit = useCallback(async () => {
    const assets = field.value || 0n

    if (!address) {
      return
    }

    setSubmitting(true)

    actions.ui.setBottomLoader({
      content: commonMessages.notification.waitingConfirmation,
    })

    try {
      const hash = await signSDK.vault.withdraw({
        userAddress: address,
        vaultAddress,
        assets,
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
            fetch.unstakeQueue()

            refetchNativeTokenBalance()
            refetchDepositTokenBalance()
          },
        })

        const blockExplorerUrl = signSDK.config.network.blockExplorerUrl

        if (!isCollateralized) {
          actions.vault.user.allocatorActions.addFirstItem({
            hash,
            assets,
            actionType: AllocatorActionType.Redeemed,
            link: blockExplorerUrl,
          })
        }

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
      console.error('Unstake send transaction error', error as Error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })
    }

    setSubmitting(false)
  }, [
    field,
    fetch,
    chainId,
    signSDK,
    actions,
    address,
    vaultAddress,
    isCollateralized,
    subgraphUpdate,
    cancelOnChange,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  return useMemo(() => ({
    submit,
    isSubmitting,
  }), [
    submit,
    isSubmitting,
  ])
}


export default useSubmit
