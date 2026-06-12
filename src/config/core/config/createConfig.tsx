import React, { useContext } from 'react'

import createContext from './createContext'
import useConfigContext, { BaseInput } from './util/useConfigContext'


type Input<T> = {
  middleware?: ConfigProvider.Middleware<T>
  networks: ConfigProvider.Networks
}

type ConfigProviderProps = Omit<BaseInput, 'networks'> & {
  children: React.ReactNode
}

const createConfig = <T extends {}>(values: Input<T>) => {
  const { networks, middleware } = values

  const ConfigContext = createContext<T>({ networks, middleware })

  const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
    const {
      children,
      serverNetworkId,
      supportedNetworkIds,
      onFinishConnect,
      onChangeAddress,
      onStartConnect,
      onConnectError,
      onChangeChain,
      onDisconnect,
      onError,
    } = props

    const context = useConfigContext<T>({
      networks,
      serverNetworkId,
      supportedNetworkIds,
      onFinishConnect,
      onChangeAddress,
      onStartConnect,
      onConnectError,
      onChangeChain,
      onDisconnect,
      onError,
      middleware,
    })

    return (
      <ConfigContext.Provider value={context}>
        {children}
      </ConfigContext.Provider>
    )
  }

  const useConfig = () => useContext<ConfigProvider.Context<T>>(ConfigContext)

  return { ConfigProvider, useConfig }
}


export default createConfig
