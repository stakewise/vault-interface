import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActions, useSubgraphUpdate, useMountedRef, useAutoFetch, useBalances } from 'hooks'
import { Action, openTxCompletedModal } from 'layouts/modals'
import notifications from 'sw-modules/notifications'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string
  fetchBalances: () => Promise<void>
}

type ClaimUnboostQueueInput = Store['vault']['user']['unboostQueue']['data']

const useUnboostQueue = (values: Input) => {
  const { vaultAddress, fetchBalances } = values

  const actions = useActions()
  const mountedRef = useMountedRef()
  const [ autofetch, setAutofetch ] = useState(false)
  const { sdk, signSDK, address, isEthereum } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchMintTokenBalance, refetchDepositTokenBalance } = useBalances()

  const fetchUnboostQueue = useCallback(async () => {
    if (address && vaultAddress && isEthereum) {
      try {
        actions.vault.user.unboostQueue.setFetching(true)

        const unboostQueue = await sdk.boost.getQueuePosition({
          userAddress: address,
          vaultAddress,
        })

        if (mountedRef.current) {
          actions.vault.user.unboostQueue.setData(unboostQueue)

          if (unboostQueue.position) {
            const needAutofetch = unboostQueue.duration === null

            setAutofetch(needAutofetch)
          }
        }
      }
      catch (error: any) {
        console.error('Fetch UnboostQueue error', error)
        actions.vault.user.unboostQueue.setFetching(false)
      }
    }
  }, [ sdk, actions, address, mountedRef, vaultAddress, isEthereum ])

  const claimUnboostQueue = useCallback(async (values: ClaimUnboostQueueInput) => {
    const { exitingAssets, exitingShares, position } = values

    if (vaultAddress && address && position) {
      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      try {
        actions.vault.user.unboostQueue.setFetching(true)

        const hash = await signSDK.boost.claimQueue({
          userAddress: address,
          vaultAddress,
          position,
        })

        if (hash) {
          await subgraphUpdate({ hash })

          fetchBalances()
          fetchUnboostQueue()
          refetchMintTokenBalance()
          refetchDepositTokenBalance()

          const tokens = [
            {
              token: signSDK.config.tokens.mintToken,
              action: Action.Receive,
              value: exitingShares,
            },
            {
              token: signSDK.config.tokens.depositToken,
              action: Action.Receive,
              value: exitingAssets,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        }
      }
      catch (error: any) {
        actions.ui.resetBottomLoader()
        actions.vault.user.unboostQueue.setFetching(false)
        console.error('Claim unboost error', error as Error)

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
    vaultAddress,
    fetchBalances,
    subgraphUpdate,
    fetchUnboostQueue,
    refetchMintTokenBalance,
    refetchDepositTokenBalance,
  ])

  useEffect(() => {
    if (!address) {
      actions.vault.user.unboostQueue.resetData()
    }
  }, [ actions, address ])

  useEffect(() => {
    return () => {
      actions.vault.user.unboostQueue.resetData()
    }
  }, [])

  useAutoFetch({
    action: fetchUnboostQueue,
    skip: !autofetch,
    interval: 60_000,
  })

  return useMemo(() => ({
    fetchUnboostQueue,
    claimUnboostQueue,
  }), [
    fetchUnboostQueue,
    claimUnboostQueue,
  ])
}


export default useUnboostQueue
