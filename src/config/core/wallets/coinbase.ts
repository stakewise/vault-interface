import { Network } from 'sdk'

import { Location } from './types'

import messages from '../messages'


const getConnector = async (_: any, options: GetConnectorOptions) => {
  const CoinbaseConnector = (await import('../connectors/CoinbaseConnector')).default

  return new CoinbaseConnector(options)
}

const coinbase = {
  id: 'coinbase',
  title: 'Coinbase',
  logo: 'connector/coinbase',
  isAutoConnect: false,
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
  ] as ChainIds[],
  location: IS_LIGHTWEIGHT_MODE
    ? [] as Location
    : [ 'desktop', 'mobile' ] as Location,
  getConnector,
} as const


export default coinbase
