import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ shimDisconnect: false })

  return connector
}

const dAppBrowser = {
  id: 'dAppBrowser',
  title: 'DApp Browser',
  logo: 'connector/monitorAddress',
  isAddTokenEnabled: false,
  isInjectedWallet: true,
  isLocalStorageSave: false,
  isDisableSwitchChain: true,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Chiado,
    Network.Hoodi,
  ] as ChainIds[],
  location: [ 'mobile' ] as Location,
  isDisabled: (() => !window.ethereum) as IsDisabled,
  getProvider: () => window.ethereum,
  getConnector,
} as const


export default dAppBrowser
