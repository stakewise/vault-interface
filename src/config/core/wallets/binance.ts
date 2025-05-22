import { Network } from 'sdk'

import { Location, IsDisabled } from './types'

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

const getConnector = async (chainId: Network) => {
  // When we access the site through mobile app then we will have injected provider,
  // but if we visit the site through desktop, then the logic is like wallet connect

  if (window.ethereum?.isBinance) {
    const InjectedConnector = (await import('../connectors/InjectedConnector')).default

    const connector = new InjectedConnector({ target, shimDisconnect: false })

    return connector
  }
  else {
    const BinanceConnector = (await import('../connectors/BinanceConnector')).default

    const connector = new BinanceConnector({ chainId })

    return connector
  }
}

const binance = {
  id: 'binance',
  title: 'Binance',
  logo: 'connector/binance',
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
