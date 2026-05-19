import React, { useCallback, useRef } from 'react'
import { configs, chains } from 'sdk'
import modal from 'modules/modal'
import { methods } from 'helpers'

import networks from './networks'
import { createConfig, wallets } from './core'
import useActions from '../hooks/data/useActions'
import connectModalId from '../layouts/modals/ConnectWalletModal/modalId'


type SupportedChain = typeof chains.mainnet | typeof chains.hoodi | typeof chains.gnosis

const supportedChains: SupportedChain[] = []

if (process.env.NEXT_PUBLIC_MAINNET_VAULT_ADDRESS) {
  supportedChains.push(chains.mainnet)
}
if (process.env.NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS) {
  supportedChains.push(chains.gnosis)
}
if (process.env.NEXT_PUBLIC_HOODI_VAULT_ADDRESS) {
  supportedChains.push(chains.hoodi)
}

const supportedNetworkIds = supportedChains.map((config) => config.id)

const middleware = (ctx: ConfigProvider.Context) => {
  const { library } = ctx

  const supportedChain = supportedChains.find((chain) => chain.id === ctx.networkId) || supportedChains[0]

  const networkId = supportedChain.id as NetworkIds
  const chainId = supportedChain.chainId as ChainIds

  const sdk = methods.getSDK({ chainId })
  const signSDK = methods.getSDK({ chainId, library })

  const isGnosis = networkId === networks.configs.gnosis.id
  const isEthereum = networkId === networks.configs.mainnet.id || networkId === networks.configs.hoodi.id

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
} = createConfig({ networks, middleware })

type ConfigProviderProps = {
  serverNetworkId: NetworkIds
  children: React.ReactNode
}

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const { children, serverNetworkId } = props

  const actions = useActions()
  const isActivationMessageVisible = useRef(false)
  const activationMessageTimeoutRef = useRef<NodeJS.Timeout>(null)

  const resetAccount = useCallback(() => {
    actions.account.balances.resetData()
    actions.account.vestings.resetData()
    actions.account.swapTokenBalances.resetData()
  }, [ actions ])

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
  }, [ actions, resetAccount ])

  return (
    <InitialConfigProvider
      serverNetworkId={serverNetworkId}
      supportedNetworkIds={supportedNetworkIds}
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
  const chainId = networks.chainById[networkId] as ChainIds
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
  wallets,
}
