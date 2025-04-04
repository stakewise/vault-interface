import React, { useCallback, useRef } from 'react'
import { configs, chains } from 'sdk'
import modal from 'modules/modal'
import methods from 'helpers/methods'

import { createConfig, networks } from './core'
import useActions from '../hooks/data/useActions'
import connectModalId from '../layouts/modals/ConnectWalletModal/modalId'


type SupportedChain = typeof chains.mainnet | typeof chains.gnosis | typeof chains.chiado

const supportedChains: SupportedChain[] = []

if (process.env.NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS) {
  supportedChains.push(chains.gnosis)
}
if (process.env.NEXT_PUBLIC_CHIADO_VAULT_ADDRESS) {
  supportedChains.push(chains.chiado)
}
if (process.env.NEXT_PUBLIC_MAINNET_VAULT_ADDRESS) {
  supportedChains.push(chains.mainnet)
}

const supportedNetworkIds = supportedChains.map((config) => config.id)

const middleware = (ctx: ConfigProvider.Context) => {
  const { library } = ctx

  const supportedChain = supportedChains.find((chain) => chain.id === ctx.networkId) || supportedChains[0]

  const networkId = supportedChain.id
  const chainId = supportedChain.chainId as ConfigProvider.Context['chainId']

  const sdk = methods.getSDK({ chainId })
  const signSDK = methods.getSDK({ chainId, library })

  const isGnosis = (
    networkId === networks.configs.chiado.id
    || networkId === networks.configs.gnosis.id
  )

  const isEthereum = networkId === networks.configs.mainnet.id

  return {
    ...ctx,
    networkId,
    chainId,
    sdk,
    signSDK,
    isGnosis,
    isEthereum,
    isTestnet: sdk.config.network.isTestnet,
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

  const actions = useActions()
  const isActivationMessageVisible = useRef(false)
  const activationMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    modal.closeModal(connectModalId)

    setTimeout(() => actions.ui.resetBottomLoader())
  }, [])

  return (
    <InitialConfigProvider
      serverNetworkId={serverNetworkId}
      supportedNetworkIds={supportedNetworkIds}
      onConnectError={handleConnectError}
      onFinishConnect={resetLoader}
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
