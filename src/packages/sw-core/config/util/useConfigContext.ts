'use client'
import { useRef, useMemo, useCallback } from 'react'
import useObjectState from 'sw-hooks/controls/useObjectState'
import { walletNames } from 'sw-helpers/constants'

import networks from './networks'
import useWallet from './useWallet'
import getInitialState from './getInitialState'
import useStorageUpdate from './useStorageUpdate'
import useCancelOnChange from './useCancelOnChange'
import InjectedConnector from '../../connectors/custom-connectors/InjectedConnector'


export type BaseInput = ConfigProvider.Callbacks & {
  serverNetworkId: NetworkIds
  supportedNetworkIds: NetworkIds[]
}

type Input<T> = BaseInput & {
  middleware?: ConfigProvider.Middleware<T>
}

const useConfigContext = <T extends {}>(values: Input<T>): ConfigProvider.Context<T> => {
  const {
    serverNetworkId,
    supportedNetworkIds,
    onFinishConnect,
    onConnectError,
    onStartConnect,
    onChangeChain,
    onDisconnect,
    onError,
    middleware,
  } = values

  const initialState = useMemo(() => getInitialState(serverNetworkId), [ serverNetworkId ])

  const [ state, setState ] = useObjectState<ConfigProvider.State>(initialState)

  const stateRef = useRef<ConfigProvider.State>(state)

  const isChainChanged = stateRef.current.networkId !== state.networkId

  let isAddressChanged = stateRef.current.address !== state.address
  const isAutoConnectChanged = stateRef.current.autoConnectChecked !== state.autoConnectChecked

  if (isAutoConnectChanged && !stateRef.current.address) {
    // autoconnect should not affect this property
    isAddressChanged = false
  }

  stateRef.current = state

  const setData = useCallback((data: Partial<ConfigProvider.State>) => {
    setState((state) => {
      const isChainChanged = data.networkId && data.networkId !== state.networkId

      if (isChainChanged && typeof onChangeChain === 'function') {
        onChangeChain()
      }

      return {
        ...state,
        ...data,
      }
    })
  }, [ onChangeChain, setState ])

  const configState = useMemo<ConfigProvider.ConfigState>(() => ({
    data: state,
    dataRef: stateRef,
    initialData: initialState,
    setData,
  }), [ state, stateRef, initialState, setData ])

  useStorageUpdate(configState)

  const { data } = configState

  const config = networks.configs[data.networkId]

  const wallet = useWallet({
    chainId: config.chainId,
    configState,
    supportedNetworkIds,
    onFinishConnect,
    onConnectError,
    onStartConnect,
    onDisconnect,
    onError,
  })

  const cancelOnChange = useCancelOnChange({
    chainId: config.chainId,
    address: state.address,
  })

  return useMemo(() => {
    const chainId = config.chainId
    const isInjectedWallet = data.connector instanceof InjectedConnector
    const isReadOnlyMode = data.activeWallet === walletNames.monitorAddress

    const ctx = {
      ...state,
      wallet,
      chainId,
      isReadOnlyMode,
      isChainChanged,
      isAddressChanged,
      isInjectedWallet,
      cancelOnChange,
    }

    if (typeof middleware === 'function') {
      return middleware(ctx)
    }

    return ctx as ConfigProvider.Context<T>
  }, [
    data,
    wallet,
    config,
    state,
    isChainChanged,
    isAddressChanged,
    middleware,
    cancelOnChange,
  ])
}


export default useConfigContext
