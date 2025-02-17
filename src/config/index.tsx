import React, { useCallback, useRef } from 'react'
import { chains, createProvider } from '@stakewise/v3-sdk'
import { createConfig } from 'sw-core'

// import useActions from '../hooks/data/useActions'


const supportedChains = [
  chains.holesky,
  chains.mainnet,
]

const supportedNetworkIds = supportedChains.map((config) => config.id)

const middleware = (ctx: ConfigProvider.Context) => {
  const { chainId, networkId, library } = ctx

  // const provider = createProvider({
  //   provider: library,
  //   network: chainId,
  //   endpoints: {},
  // })

  const config = supportedChains.find(({ id }) => networkId === id) as typeof supportedChains[number]

  return {
    ...ctx,
    config,
    // provider,
    isMainnet: networkId === chains.mainnet.id,
  }
}

const {
  useConfig,
  ConfigProvider: InitialConfigProvider,
} = createConfig(middleware)

type ConfigProviderProps = {
  serverNetworkId: NetworkIds
  children: React.ReactNode
}

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const { children, serverNetworkId } = props

  const actions = null
  // const actions = useActions()
  const isActivationMessageVisible = useRef(false)
  const activationMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetAccount = useCallback(() => {
    // actions.account.balances.resetData()
  }, [ actions ])

  const setLoader = useCallback((activationMessage: Intl.Message | string) => {
    activationMessageTimeoutRef.current = setTimeout(() => {
      isActivationMessageVisible.current = true
      // actions.ui.setBottomLoader({ content: activationMessage })
    }, 1000)
  }, [ actions ])

  const resetLoader = useCallback(() => {
    if (isActivationMessageVisible.current) {
      isActivationMessageVisible.current = false
      // actions.ui.resetBottomLoader()
    }
    if (activationMessageTimeoutRef.current) {
      clearTimeout(activationMessageTimeoutRef.current)
    }
  }, [ actions ])

  return (
    <InitialConfigProvider
      serverNetworkId={serverNetworkId}
      supportedNetworkIds={supportedNetworkIds}
      onFinishConnect={resetLoader}
      onChangeChain={resetAccount}
      onConnectError={resetLoader}
      onDisconnect={resetAccount}
      onStartConnect={setLoader}
    >
      {children}
    </InitialConfigProvider>
  )
}


export {
  useConfig,
  ConfigProvider,
  supportedChains,
}
