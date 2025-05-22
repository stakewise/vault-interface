import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getProvider = () => window.rabby as any

const target = () => ({
  id: 'rabby',
  name: 'Rabby Provider',
  provider: getProvider(),
})

const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}

const rabby = {
  id: 'rabby',
  title: 'Rabby Wallet',
  logo: 'connector/rabby',
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
  isDisabled: (() => !window.rabby) as IsDisabled,
  getProvider,
  getConnector,
} as const


export default rabby
