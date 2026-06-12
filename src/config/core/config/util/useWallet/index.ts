import { useCallback, useMemo } from 'react'

import useConnect from './useConnect'
import wallets from '../../../wallets'
import useDisconnect from './useDisconnect'
import useChangeChain from './useChangeChain'
import useAutoConnect from './useAutoConnect'
import useUpdateWallet from './useUpdateWallet'
import { BaseInput } from '../useConfigContext'
import useCallsOnChange from './useCallsOnChange'


type Input = Omit<BaseInput, 'serverNetworkId'> & {
  chainId: number
  configState: ConfigProvider.ConfigState
}

const useWallet = (values: Input): ConfigProvider.Wallet => {
  const {
    networks,
    chainId,
    configState,
    supportedNetworkIds,
    onError,
    onDisconnect,
    onConnectError,
    onStartConnect,
    onFinishConnect,
  } = values

  const {
    onChangeChain,
    onChangeAddress,
    subscribeBeforeChange,
    unsubscribeBeforeChange,
  } = useCallsOnChange()

  const disconnect = useDisconnect({ configState, onError, onDisconnect })

  const changeChain = useChangeChain({
    networks,
    configState,
    supportedNetworkIds,
    onChangeChain,
    onError,
  })

  const connect = useConnect({
    networks,
    configState,
    onError,
    disconnect,
    onConnectError,
    onStartConnect,
    onFinishConnect,
  })

  const { setData } = configState

  const setAddress = useCallback((address: string) => {
    setData({
      address,
      autoConnectChecked: true,
      activeWallet: wallets.monitorAddress.id,
    })
  }, [ setData ])

  useAutoConnect({
    configState,
    networks,
    connect,
  })

  useUpdateWallet({
    networks,
    supportedNetworkIds,
    configState,
    chainId,
    disconnect,
    onChangeChain,
    onChangeAddress,
  })

  return useMemo(() => ({
    connect,
    disconnect,
    setAddress,
    changeChain,
    subscribeBeforeChange,
    unsubscribeBeforeChange,
  }), [
    connect,
    disconnect,
    setAddress,
    changeChain,
    subscribeBeforeChange,
    unsubscribeBeforeChange,
  ])
}


export default useWallet
