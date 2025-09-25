import { useCallback, useMemo, useState } from 'react'
import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'
import { useStore, useActions, useBalances, useSubgraphUpdate } from 'hooks'
import notifications from 'modules/notifications'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import vaultHooks from '../index'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  unboostQueue: store.vault.user.unboostQueue.data,
  isUnboostQueueFetching: store.vault.user.unboostQueue.isFetching,
})

const isEnvClaimUnboostQueueDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_UNBOOST_QUEUE)

const useClaimUnboostQueue = (values: Input) => {
  const { fetchAllUserData } = values

  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { signSDK, chainId, address, isReadOnlyMode, cancelOnChange } = useConfig()
  const { unboostQueue, vaultAddress, isUnboostQueueFetching } = useStore(storeSelector)

  const {
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchMintTokenBalance,
  } = useBalances()

  const [ isSubmitting, setSubmitting ] = useState(false)

  const claim = useCallback(async () => {
    if (address && unboostQueue.position && vaultAddress) {
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
            refetchMintTokenBalance()
            refetchNativeTokenBalance()
            refetchDepositTokenBalance()
          },
        })

        const hash = await signSDK.boost.claimQueue({
          position: unboostQueue.position,
          userAddress: address,
          vaultAddress,
        })

        if (hash) {
          await subgraphUpdate({ hash })
          await onSuccess()

          setSubmitting(false)

          const tokens = [
            {
              token: signSDK.config.tokens.mintToken,
              action: Action.Receive,
              value: unboostQueue.exitingShares,
            },
            {
              token: signSDK.config.tokens.depositToken,
              action: Action.Receive,
              value: unboostQueue.exitingAssets,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        }
      }
      catch (error: any) {
        actions.ui.resetBottomLoader()

        console.error('Claim unboost queue error', error as Error)

        setSubmitting(false)

        notifications.open({
          type: 'error',
          text: commonMessages.notification.failed,
        })
      }
    }
  }, [
    chainId,
    signSDK,
    actions,
    address,
    vaultAddress,
    unboostQueue,
    cancelOnChange,
    subgraphUpdate,
    fetchAllUserData,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  const isClaimUnboostQueueDisabled = (
    !address
    || isReadOnlyMode
    || !unboostQueue.isClaimable
    || isEnvClaimUnboostQueueDisabled
  )

  const isClaimUnboostQueueLoading = isSubmitting || isUnboostQueueFetching

  return useMemo(() => ({
    isClaimUnboostQueueLoading,
    isClaimUnboostQueueDisabled,
    claim,
  }), [
    isClaimUnboostQueueLoading,
    isClaimUnboostQueueDisabled,
    claim,
  ])
}

useClaimUnboostQueue.mock = {
  claim: () => Promise.resolve(),
  isClaimUnboostQueueLoading: false,
  isClaimUnboostQueueDisabled: false,
} as ReturnType<typeof useClaimUnboostQueue>


export default useClaimUnboostQueue
