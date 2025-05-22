import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getProvider = () => window.trustwallet as any

const target = () => ({
  id: 'trustwallet',
  name: 'Trust wallet Provider',
  provider: getProvider(),
})

const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}

const trustWallet = {
  id: 'trustWallet',
  title: 'Trust Wallet',
  logo: 'connector/trustWallet',
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
  isDisabled: (() => !window.trustwallet) as IsDisabled,
  getConnector,
  getProvider,
} as const


export default trustWallet
