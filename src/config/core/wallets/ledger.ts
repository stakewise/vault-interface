import { Network } from 'sdk'

import { Location } from './types'

import messages from '../messages'


const getConnector = async (chainId: Network, options: GetConnectorOptions) => {
  const { transport, networks, disconnect } = options

  const LedgerConnector = (await import('../connectors/LedgerConnector')).default

  return new LedgerConnector({ chainId, transport, networks, onError: disconnect })
}

const ledger = {
  id: 'ledger',
  title: 'Ledger',
  logo: 'connector/ledger',
  isAutoConnect: false,
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Hoodi,
  ] as ChainIds[],
  location: IS_LIGHTWEIGHT_MODE
    ? [] as Location
    : [ 'desktop' ] as Location,
  getConnector,
} as const


export default ledger
