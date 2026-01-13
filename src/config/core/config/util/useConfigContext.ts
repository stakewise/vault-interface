'use client'
import { useRef, useMemo, useCallback } from 'react'
import useObjectState from 'hooks/controls/useObjectState'

import networks from './networks'
import useWallet from './useWallet'
import wallets from '../../wallets'
import getInitialState from './getInitialState'
import useStorageUpdate from './useStorageUpdate'
import useCancelOnChange from './useCancelOnChange'


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
    onChangeAddress,
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

  stateRef.current = state

  const setData = useCallback((data: Partial<ConfigProvider.State>) => {
    setState((state) => {
      const isChainChanged = data.networkId && data.networkId !== state.networkId
      const isAddressChanged = (
        state.autoConnectChecked
        && data.address !== state.address
        && typeof data.address !== 'undefined'
      )

      if (isAddressChanged && typeof onChangeAddress === 'function') {
        onChangeAddress()
      }

      if (isChainChanged && typeof onChangeChain === 'function') {
        onChangeChain()
      }

      return {
        ...state,
        ...data,
      }
    })
  }, [ onChangeChain, onChangeAddress, setState ])

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
    const isReadOnlyMode = data.activeWallet === wallets.monitorAddress.id

    const ctx = {
      ...state,
      wallet,
      chainId,
      isReadOnlyMode,
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
    middleware,
    cancelOnChange,
  ])
}


export default useConfigContext
