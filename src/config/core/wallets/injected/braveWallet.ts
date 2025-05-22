import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getProvider = () => window.braveEthereum as any

const target = () => ({
  id: 'braveWallet',
  name: 'Brave Wallet Provider',
  provider: getProvider(),
})

const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}

const braveWallet = {
  id: 'braveWallet',
  title: 'Brave Wallet',
  logo: 'connector/braveBrowser',
  isAddTokenEnabled: true,
  isInjectedWallet: true,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Chiado,
    Network.Hoodi,
  ] as ChainIds[],
  location: [ 'desktop' ] as Location,
  isDisabled: (() => !window.braveEthereum) as IsDisabled,
  getConnector,
  getProvider,
} as const


export default braveWallet
