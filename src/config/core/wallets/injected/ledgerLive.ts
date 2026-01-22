import { Network } from 'sdk'

import { Location, IsDisabled } from '../types'

import messages from '../../messages'


const getConnector = async () => {
  const InjectedConnector = (await import('../../connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ shimDisconnect: false })

  return connector
}

const ledgerLive = {
  id: 'ledgerLive',
  title: 'Ledger Live',
  logo: 'connector/ledgerLive',
  isAddTokenEnabled: false,
  isInjectedWallet: true,
  isLocalStorageSave: true,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Hoodi,
  ] as ChainIds[],
  location: [ 'desktop', 'mobile' ] as Location,
  isDisabled: (() => !window.ethereum?.isLedgerLive) as IsDisabled,
  getProvider: () => window.ethereum,
  getConnector,
} as const


export default ledgerLive
