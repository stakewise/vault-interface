import React from 'react'

import networks from './util/networks'
import getInitialState from './util/getInitialState'


type Input<T> = {
  middleware?: ConfigProvider.Middleware<T>
}

const createContext = <T extends {}>(values: Input<T> = {}): (
  React.Context<ConfigProvider.Context<T>>
) => {
  const { middleware } = values

  const initialState = getInitialState()

  const selectedChain = networks.chainById[initialState.networkId]

  let mockContext: any = {
    ...initialState,

    chainId: selectedChain,

    isGnosis: false,
    isEthereum: false,
    isReadOnlyMode: false,

    wallet: {
      connect: () => Promise.resolve(),
      disconnect: () => Promise.resolve(),
      setAddress: () => Promise.resolve(),
      changeChain: () => Promise.resolve(),
    },
  }

  let context: ConfigProvider.Context<T> = mockContext

  if (typeof middleware === 'function') {
    context = middleware(mockContext)
  }

  return React.createContext<ConfigProvider.Context<T>>(mockContext)
}


export default createContext
