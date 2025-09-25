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
  unstakeQueue: store.vault.user.unstakeQueue.data,
  vaultAddress: store.vault.base.data.vaultAddress,
  isUnstakeQueueFetching: store.vault.user.unstakeQueue.isFetching,
})

const isEnvClaimUnstakeQueueDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_UNSTAKE_QUEUE)

const useClaimUnstakeQueue = (values: Input) => {
  const { fetchAllUserData } = values

  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { signSDK, chainId, address, isReadOnlyMode, cancelOnChange } = useConfig()
  const { unstakeQueue, vaultAddress, isUnstakeQueueFetching } = useStore(storeSelector)

  const {
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchMintTokenBalance,
  } = useBalances()

  const [ isSubmitting, setSubmitting ] = useState(false)

  const claim = useCallback(async () => {
    if (address && unstakeQueue.positions.length && vaultAddress) {
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

        actions.vault.user.unstakeQueue.setFetching(true)

        const hash = await signSDK.vault.claimExitQueue({
          positions: unstakeQueue.positions,
          userAddress: address,
          vaultAddress,
        })

        if (hash) {
          await subgraphUpdate({ hash })
          await onSuccess()

          setSubmitting(false)

          const tokens = [
            {
              token: signSDK.config.tokens.depositToken,
              value: unstakeQueue.withdrawable,
              action: Action.Unstake,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        }
      }
      catch (error: any) {
        setSubmitting(false)
        actions.ui.resetBottomLoader()
        actions.vault.user.unstakeQueue.setFetching(false)
        console.error('Claim unstake queue error', error as Error)

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
    unstakeQueue,
    cancelOnChange,
    subgraphUpdate,
    fetchAllUserData,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  const isClaimUnstakeQueueDisabled = (
    !address
    || isReadOnlyMode
    || !unstakeQueue.withdrawable
    || isEnvClaimUnstakeQueueDisabled
  )

  const isClaimUnstakeQueueLoading = isSubmitting || isUnstakeQueueFetching

  return useMemo(() => ({
    isClaimUnstakeQueueLoading,
    isClaimUnstakeQueueDisabled,
    claim,
  }), [
    isClaimUnstakeQueueLoading,
    isClaimUnstakeQueueDisabled,
    claim,
  ])
}

useClaimUnstakeQueue.mock = {
  claim: () => Promise.resolve(),
  isClaimUnstakeQueueLoading: false,
  isClaimUnstakeQueueDisabled: false,
} as ReturnType<typeof useClaimUnstakeQueue>


export default useClaimUnstakeQueue
