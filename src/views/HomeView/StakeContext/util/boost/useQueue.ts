import { useCallback, useEffect, useMemo } from 'react'
import { useActions, useAutoFetch, useBalances, useObjectState, useSubgraphUpdate } from 'hooks'
import { Action, openTxCompletedModal } from 'layouts/modals'
import notifications from 'sw-modules/notifications'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string
  data: StakePage.Context['data']
}

type State = Omit<StakePage.Context['unboostQueue'], 'claim' | 'refetchData'>

const initialState: State = {
  position: null,
  duration: null,
  isFetching: true,
  exitingAssets: 0n,
  exitingShares: 0n,
  isClaimable: false,
  isSubmitting: false,
}

export const mockQueue: StakePage.Context['unboostQueue'] = {
  ...initialState,
  claim: () => Promise.resolve(),
  refetchData: () => Promise.resolve(),
}

const useUnboostQueue = (values: Input) => {
  const { vaultAddress, data } = values

  const actions = useActions()
  const subgraphUpdate = useSubgraphUpdate()
  const { signSDK, chainId, address, autoConnectChecked, cancelOnChange } = useConfig()

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
      const unboostQueue = await signSDK.boost.getQueuePosition({
        vaultAddress,
        userAddress: address,
      })

      setState({
        ...(unboostQueue as Omit<State, 'isFetching' | 'isSubmitting'>),
        isFetching: false,
      })
    }
    catch (error: any) {
      console.error('Unstake: fetch unboost queue error', error)

      notifications.open({
        text: commonMessages.notification.somethingWentWrong,
        type: 'error',
      })

      setState({ isFetching: false })
    }
  }, [ address, signSDK, vaultAddress, setState ])

  const claim = useCallback(async () => {
    if (address && state.position) {
      try {
        setState({ isSubmitting: true })

        actions.ui.setBottomLoader({
          content: commonMessages.notification.waitingConfirmation,
        })

        const hash = await signSDK.boost.claimQueue({
          position: state.position,
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
              data.refetchData()

              refetchMintTokenBalance()
              refetchNativeTokenBalance()
              refetchDepositTokenBalance()
            },
          })

          setState({ isSubmitting: false })

          const tokens = [
            {
              token: signSDK.config.tokens.mintToken,
              action: Action.Receive,
              value: state.exitingShares,
            },
            {
              token: signSDK.config.tokens.depositToken,
              action: Action.Receive,
              value: state.exitingAssets,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        }
      }
      catch (error: any) {
        actions.ui.resetBottomLoader()
        console.error('Claim unboost queue error', error as Error)

        setState({ isSubmitting: false })

        notifications.open({
          type: 'error',
          text: commonMessages.notification.failed,
        })
      }
    }
  }, [
    data,
    state,
    chainId,
    signSDK,
    actions,
    address,
    vaultAddress,
    setState,
    fetchData,
    cancelOnChange,
    subgraphUpdate,
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


export default useUnboostQueue
