import React from 'react'

import getInitialState from './util/getInitialState'


type Input<T> = {
  middleware?: ConfigProvider.Middleware<T>
  networks: ConfigProvider.Networks
}

const createContext = <T extends {}>(values: Input<T>): (
  React.Context<ConfigProvider.Context<T>>
) => {
  const { networks, middleware } = values

  const initialState = getInitialState()

  const selectedChain = networks.chainById[initialState.networkId]

  const mockContext: any = {
    ...initialState,

    chainId: selectedChain,

    isReadOnlyMode: false,

    wallet: {
      connect: () => Promise.resolve(),
      disconnect: () => Promise.resolve(),
      setAddress: () => Promise.resolve(),
      changeChain: () => Promise.resolve(),
      subscribeBeforeChange: () => Promise.resolve(),
      unsubscribeBeforeChange: () => Promise.resolve(),
    },
  }

  let context: ConfigProvider.Context<T> = mockContext

  if (typeof middleware === 'function') {
    context = middleware(mockContext, networks)
  }

  return React.createContext<ConfigProvider.Context<T>>(context)
}


export default createContext
