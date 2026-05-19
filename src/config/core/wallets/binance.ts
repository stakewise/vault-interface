import { Network } from 'sdk'

import { Location, IsDisabled } from './types'

import { getInjectedConnector } from './injected/helpers'

import messages from '../messages'


const getProvider = () => window.ethereum as any

const isDisabled: IsDisabled = (isDesktop) => {
  if (!isDesktop) {
    return !window.ethereum?.isBinance
  }

  return false
}

const target = () => {
  const provider = getProvider()

  return {
    id: 'binance',
    name: 'Binance Provider',
    provider,
  }
}

const getConnector = async (chainId: Network, options: GetConnectorOptions) => {
  // When we access the site through mobile app then we will have injected provider,
  // but if we visit the site through desktop, then the logic is like wallet connect

  if (window.ethereum?.isBinance) {
    return getInjectedConnector({ target, shimDisconnect: false })(chainId, options)
  }
  else {
    const BinanceConnector = (await import('../connectors/BinanceConnector')).default

    return new BinanceConnector({ chainId, ...options })
  }
}

const binance = {
  id: 'binance',
  title: 'Binance',
  logo: 'connector/binance',
  isAutoConnect: false,
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: false,
  isDisableSwitchChain: true,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [ Network.Mainnet ] as ChainIds[],
  location: [ 'desktop', 'mobile' ] as Location,
  getConnector,
  getProvider,
  isDisabled,
} as const


export default binance
