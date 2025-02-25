import { useCallback, useEffect, useMemo } from 'react'
import { useActions, useAutoFetch, useBalances, useObjectState, useSubgraphUpdate } from 'hooks'
import { Action, openTxCompletedModal } from 'layouts/modals'
import notifications from 'sw-modules/notifications'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'


type State = Omit<StakePage.Context['unstakeQueue'], 'claim' | 'refetchData'>

const initialState: State = {
  total: 0n,
  requests: [],
  positions: [],
  duration: null,
  withdrawable: 0n,
  isFetching: true,
  isSubmitting: false,
}

export const mockQueue: StakePage.Context['unstakeQueue'] = {
  ...initialState,
  claim: () => Promise.resolve(),
  refetchData: () => Promise.resolve(),
}

const useQueue = (vaultAddress: string) => {
  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { signSDK, address, chainId, autoConnectChecked, cancelOnChange } = useConfig()

  const {
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchMintTokenBalance,
  } = useBalances()

  const [ state, setState ] = useObjectState<State>({
    ...initialState,
    isFetching: Boolean(address),
  })

  const fetchData = useCallback(async () => {
    if (!address) {
      return
    }

    try {
      const exitQueue = await signSDK.vault.getExitQueuePositions({
        userAddress: address,
        isClaimed: false,
        vaultAddress,
      })

      setState({
        total: exitQueue.total,
        requests: exitQueue.requests,
        duration: exitQueue.duration,
        positions: exitQueue.positions,
        withdrawable: exitQueue.withdrawable,
        isFetching: false,
      })
    }
    catch (error: any) {
      notifications.open({
        text: commonMessages.notification.somethingWentWrong,
        type: 'error',
      })

      setState({ isFetching: false })
    }
  }, [ address, signSDK, vaultAddress, setState ])

  const claim = useCallback(async () => {
    if (address) {
      try {
        setState({ isSubmitting: true })

        actions.ui.setBottomLoader({
          content: commonMessages.notification.waitingConfirmation,
        })

        const hash = await signSDK.vault.claimExitQueue({
          positions: state.positions,
          userAddress: address,
          vaultAddress,
        })

        if (hash) {
          await subgraphUpdate({ hash })

          cancelOnChange({
            address,
            chainId,
            logic: () => {
              fetchData()
              refetchMintTokenBalance()
              refetchNativeTokenBalance()
              refetchDepositTokenBalance()
            },
          })

          setState({ isSubmitting: false })

          const tokens = [
            {
              token: signSDK.config.tokens.mintToken,
              value: state.withdrawable,
              action: Action.Unstake,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        }
      }
      catch (error: any) {
        actions.ui.resetBottomLoader()

        setState({ isSubmitting: false })

        notifications.open({
          type: 'error',
          text: commonMessages.notification.failed,
        })
      }
    }
  }, [
    state,
    chainId,
    signSDK,
    actions,
    address,
    vaultAddress,
    setState,
    fetchData,
    subgraphUpdate,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  useEffect(() => {
    fetchData()
  }, [ fetchData ])

  useEffect(() => {
    if (!address && autoConnectChecked) {
      setState({
        ...initialState,
        isFetching: false,
      })
    }
  }, [ address, autoConnectChecked, setState ])

  useAutoFetch({
    action: fetchData,
    skip: Boolean(state.duration) || !address,
    interval: 60_000,
  })

  return useMemo(() => ({
    ...state,
    claim,
    refetchData: fetchData,
  }), [ state, claim, fetchData ])
}


export default useQueue
