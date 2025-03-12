import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActions, useSubgraphUpdate, useMountedRef, useAutoFetch, useBalances } from 'hooks'
import { Action, openTxCompletedModal } from 'layouts/modals'
import notifications from 'sw-modules/notifications'
import { commonMessages } from 'helpers'
import { AllocatorActionType } from 'sdk'
import { useConfig } from 'config'


type ClaimExitQueueInput = Store['vault']['user']['exitQueue']['data']

const useExitQueue = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { signSDK, address, isGnosis } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const [ autofetch, setAutofetch ] = useState(false)

  const {
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  } = useBalances()

  const fetchExitQueue = useCallback(async () => {
    if (address && vaultAddress) {
      try {
        actions.vault.user.exitQueue.setFetching(true)

        const exitQueue = await signSDK.vault.getExitQueuePositions({
          userAddress: address,
          isClaimed: false,
          vaultAddress,
        })

        if (mountedRef.current) {
          actions.vault.user.exitQueue.setData({
            withdrawable: exitQueue.withdrawable,
            positions: exitQueue.positions,
            duration: exitQueue.duration,
            requests: exitQueue.requests,
            total: exitQueue.total,
          })

          if (exitQueue.total) {
            const needAutofetch = exitQueue.duration === null

            setAutofetch(needAutofetch)
          }
        }
      }
      catch (error: any) {
        console.error('Fetch ExitQueue error', error)
        actions.vault.user.exitQueue.setFetching(false)
      }
    }
  }, [ signSDK, actions, address, mountedRef, vaultAddress ])

  const claimExitQueue = useCallback(async (exitQueueData: ClaimExitQueueInput) => {
    if (vaultAddress && address) {
      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      try {
        actions.vault.user.exitQueue.setFetching(true)

        const hash = await signSDK.vault.claimExitQueue({
          positions: exitQueueData.positions,
          userAddress: address,
          vaultAddress,
        })

        if (hash) {
          await subgraphUpdate({ hash })

          fetchExitQueue()
          refetchDepositTokenBalance()

          if (isGnosis) {
            refetchNativeTokenBalance()
          }

          const blockExplorerUrl = signSDK.config.network.blockExplorerUrl

          actions.vault.user.allocatorActions.addFirstItem({
            hash,
            assets: exitQueueData.withdrawable,
            actionType: AllocatorActionType.ExitedAssetsClaimed,
            link: blockExplorerUrl,
          })

          const tokens = [
            {
              token: signSDK.config.tokens.depositToken,
              value: exitQueueData.withdrawable,
              action: Action.Unstake,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        }
      }
      catch (error: any) {
        actions.ui.resetBottomLoader()
        actions.vault.user.exitQueue.setFetching(false)
        console.error('Claim error', error as Error)

        notifications.open({
          type: 'error',
          text: commonMessages.notification.failed,
        })
      }
    }
  }, [
    signSDK,
    actions,
    address,
    isGnosis,
    vaultAddress,
    fetchExitQueue,
    subgraphUpdate,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  useEffect(() => {
    fetchExitQueue()
  }, [ fetchExitQueue ])

  useEffect(() => {
    if (!address) {
      actions.vault.user.exitQueue.resetData()
    }
  }, [ actions, address ])

  useEffect(() => {
    return () => {
      actions.vault.user.exitQueue.resetData()
    }
  }, [])

  useAutoFetch({
    action: fetchExitQueue,
    skip: !autofetch,
    interval: 60_000,
  })

  return useMemo(() => ({
    fetchExitQueue,
    claimExitQueue,
  }), [
    fetchExitQueue,
    claimExitQueue,
  ])
}


export default useExitQueue
