import { useCallback, useMemo } from 'react'
import { walletNames } from 'sw-helpers/constants'

import useConnect from './useConnect'
import useDisconnect from './useDisconnect'
import useChangeChain from './useChangeChain'
import useAutoConnect from './useAutoConnect'
import useUpdateWallet from './useUpdateWallet'
import { BaseInput } from '../useConfigContext'


type Input = Omit<BaseInput, 'serverNetworkId'> & {
  chainId: number
  configState: ConfigProvider.ConfigState
}

const useWallet = (values: Input): ConfigProvider.Wallet => {
  const {
    chainId,
    configState,
    supportedNetworkIds,
    onError,
    onDisconnect,
    onConnectError,
    onStartConnect,
    onFinishConnect,
  } = values

  const connect = useConnect({
    configState,
    onError,
    onConnectError,
    onStartConnect,
    onFinishConnect,
  })

  const disconnect = useDisconnect({ configState, onError, onDisconnect })
  const changeChain = useChangeChain({ configState, supportedNetworkIds, onError })

  const { setData } = configState

  const setAddress = useCallback((address: string) => {
    setData({
      address,
      autoConnectChecked: true,
      activeWallet: walletNames.monitorAddress,
    })
  }, [ setData ])

  useAutoConnect({
    configState,
    connect,
  })

  useUpdateWallet({
    supportedNetworkIds,
    configState,
    chainId,
    disconnect,
  })

  return useMemo(() => ({
    connect,
    disconnect,
    setAddress,
    changeChain,
  }), [
    connect,
    disconnect,
    setAddress,
    changeChain,
  ])
}


export default useWallet
