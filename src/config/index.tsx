import React, { useCallback, useRef } from 'react'
import { createConfig, networks } from 'sw-core'
import { configs, chains } from 'sdk'
import modal from 'sw-modules/modal'
import methods from 'sw-methods'

import useActions from '../hooks/data/useActions'

import connectModalId from '../layouts/modals/ConnectWalletModal/modalId'


const supportedChains = [
  chains.gnosis,
  chains.chiado,
  chains.holesky,
  chains.mainnet,
]

const supportedNetworkIds = supportedChains.map((config) => config.id)

const middleware = (ctx: ConfigProvider.Context) => {
  const { chainId, networkId, library } = ctx

  const sdk = methods.getSDK({ chainId })
  const signSDK = methods.getSDK({ chainId, library })

  const isGnosis = (
    networkId === networks.configs.chiado.id
    || networkId === networks.configs.gnosis.id
  )

  const isEthereum = (
    networkId === networks.configs.holesky.id
    || networkId === networks.configs.mainnet.id
  )

  return {
    ...ctx,
    sdk,
    signSDK,
    isGnosis,
    isEthereum,
    isTestnet: sdk.config.network.isTestnet,
    isMainnet: networkId === chains.mainnet.id,
    isHolesky: networkId === chains.holesky.id,
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

  const actions = useActions()
  const isActivationMessageVisible = useRef(false)
  const activationMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetAccount = useCallback(() => {
    // actions.account.balances.resetData()
    // actions.account.vestings.resetData()
    //
    // actions.vaults.operate.resetData(false)
    // actions.vaults.deposits.resetData(false)
  }, [ actions ])

  const resetAccountAndVaults = useCallback(() => {
    // actions.vaults.osTokenVaults.resetData()
    // actions.vaults.all.resetData()
    resetAccount()
  }, [ actions, resetAccount ])

  const setLoader = useCallback((activationMessage: Intl.Message | string) => {
    activationMessageTimeoutRef.current = setTimeout(() => {
      isActivationMessageVisible.current = true
      actions.ui.setBottomLoader({ content: activationMessage })
    }, 1000)
  }, [ actions ])

  const resetLoader = useCallback(() => {
    if (isActivationMessageVisible.current) {
      isActivationMessageVisible.current = false
      actions.ui.resetBottomLoader()
    }
    if (activationMessageTimeoutRef.current) {
      clearTimeout(activationMessageTimeoutRef.current)
    }
  }, [ actions ])

  const handleConnectError = useCallback(() => {
    resetAccount()
    modal.closeModal(connectModalId)

    setTimeout(() => actions.ui.resetBottomLoader())
  }, [])

  return (
    <InitialConfigProvider
      serverNetworkId={serverNetworkId}
      supportedNetworkIds={supportedNetworkIds}
      onChangeChain={resetAccountAndVaults}
      onConnectError={handleConnectError}
      onFinishConnect={resetLoader}
      onDisconnect={resetAccount}
      onStartConnect={setLoader}
    >
      {children}
    </InitialConfigProvider>
  )
}

const getConfig = (networkId: NetworkIds): Config => {
  const chainId = networks.chainById[networkId]
  const config = configs[chainId]

  if (!config) {
    throw new Error('Wrong network passed to config')
  }

  return config
}


export {
  getConfig,
  useConfig,
  ConfigProvider,
  supportedChains,
}
