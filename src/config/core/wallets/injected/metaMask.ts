import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getProvider = () => window.ethereum as any

const target = () => {
  let provider = getProvider()

  const providers = provider?.providers

  if (providers?.length) {
    provider = providers.find((item: any) => item.isMetaMask)
  }

  return {
    id: 'metamask',
    name: 'MetaMask Provider',
    provider,
  }
}

const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}

const metaMask = {
  id: 'metaMask',
  title: 'MetaMask',
  logo: 'connector/metamask',
  isAddTokenEnabled: true,
  isInjectedWallet: true,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Hoodi,
  ] as ChainIds[],
  location: [ 'desktop', 'mobile' ] as Location,
  isDisabled: (() => !window.ethereum) as IsDisabled,
  getProvider,
  getConnector,
} as const


export default metaMask
