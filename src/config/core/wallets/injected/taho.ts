import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getProvider = () => window.taho as any

const target = () => ({
  id: 'taho',
  name: 'Taho Provider',
  provider: getProvider(),
})

const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}

const taho = {
  id: 'taho',
  title: 'Taho',
  logo: 'connector/taho',
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
  isDisabled: (() => !window.taho) as IsDisabled,
  getConnector,
  getProvider,
} as const


export default taho
