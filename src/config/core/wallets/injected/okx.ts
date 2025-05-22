import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getProvider = () => window.okxwallet as any

const target = () => ({
  id: 'okx',
  name: 'OKX Provider',
  provider: getProvider(),
})

const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}

const okx = {
  id: 'okx',
  title: 'OKX',
  logo: 'connector/okx',
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
  location: [ 'desktop', 'mobile' ] as Location,
  isDisabled: (() => !window.okxwallet) as IsDisabled,
  getProvider,
  getConnector,
} as const


export default okx
