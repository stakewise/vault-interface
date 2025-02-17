import React, { useContext } from 'react'

import createContext from './createContext'
import useConfigContext, { BaseInput } from './util/useConfigContext'


type ConfigProviderProps = BaseInput & {
  children: React.ReactNode
}

const createConfig = <T extends {}>(middleware?: ConfigProvider.Middleware<T>) => {
  const ConfigContext = createContext<T>({ middleware })

  const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
    const {
      children,
      serverNetworkId,
      supportedNetworkIds,
      onFinishConnect,
      onStartConnect,
      onConnectError,
      onChangeChain,
      onDisconnect,
      onError,
    } = props

    const context = useConfigContext<T>({
      supportedNetworkIds,
      serverNetworkId,
      onFinishConnect,
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
