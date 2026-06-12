'use client'
import { useRef, useMemo, useCallback } from 'react'
import getSDK from 'helpers/methods/getSDK'
import useObjectState from 'hooks/controls/useObjectState'

import useWallet from './useWallet'
import wallets from '../../wallets'
import getInitialState from './getInitialState'
import useStorageUpdate from './useStorageUpdate'
import useCancelOnChange from './useCancelOnChange'


export type BaseInput = ConfigProvider.Callbacks & {
  serverNetworkId: string
  supportedNetworkIds: NetworkIds[]
  networks: ConfigProvider.Networks
}

type Input<T> = BaseInput & {
  middleware?: ConfigProvider.Middleware<T>
}

const useConfigContext = <T extends {}>(values: Input<T>): ConfigProvider.Context<T> => {
  const {
    networks,
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

  const configState = useMemo<ConfigProvider.ConfigState>(() => {
    const data = state

    // Fallback to mainnet if current networkId is not supported anymore
    if (!networks.configs[state.networkId]) {
      data.networkId = 'mainnet'
      stateRef.current.networkId = data.networkId
    }

    return {
      data,
      dataRef: stateRef,
      initialData: initialState,
      setData,
    }
  }, [ state, stateRef, networks, initialState, setData ])

  useStorageUpdate({ networks, configState })

  const { data } = configState

  const chainId = networks.chainById[data.networkId]

  const wallet = useWallet({
    networks,
    chainId,
    configState,
    supportedNetworkIds,
    onFinishConnect,
    onConnectError,
    onStartConnect,
    onDisconnect,
    onError,
  })

  const cancelOnChange = useCancelOnChange({
    chainId: chainId as ChainIds,
    address: state.address,
  })

  const detectChain = useCallback((chainId: number) => {
    const networkId = networks.idByChain[chainId]
    const network = networks.configs[networkId]

    const readOnlyProvider = getSDK({ chainId: network.chainId as ChainIds }).provider

    return {
      network,
      readOnlyProvider,
    }
  }, [ networks ])

  return useMemo(() => {
    const isReadOnlyMode = data.activeWallet === wallets.monitorAddress.id

    const ctx = {
      ...state,
      ...detectChain(chainId),
      wallet,
      chainId,
      isReadOnlyMode,
      cancelOnChange,
    }

    if (typeof middleware === 'function') {
      return middleware(ctx, networks)
    }

    return ctx as ConfigProvider.Context<T>
  }, [
    data,
    state,
    wallet,
    chainId,
    networks,
    middleware,
    detectChain,
    cancelOnChange,
  ])
}


export default useConfigContext
