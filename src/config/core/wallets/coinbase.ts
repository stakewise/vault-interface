import { Network } from 'sdk'

import { Location } from './types'

import messages from '../messages'


const getConnector = async () => {
  const CoinbaseConnector = (await import('../connectors/CoinbaseConnector')).default

  const connector = new CoinbaseConnector()

  return connector
}

const coinbase = {
  id: 'coinbase',
  title: 'Coinbase',
  logo: 'connector/coinbase',
  networks: [
    Network.Mainnet,
    Network.Gnosis,
  ] as ChainIds[],
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  location: IS_LIGHTWEIGHT_MODE
    ? [] as Location
    : [ 'desktop', 'mobile' ] as Location,
  getConnector,
} as const


export default coinbase
