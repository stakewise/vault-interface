import { Network } from 'sdk'

import { createInjectedWallet } from './helpers'


const ledgerLive = createInjectedWallet({
  id: 'ledgerLive',
  rdns: 'com.ledger',
  title: 'Ledger Live',
  logo: 'connector/ledgerLive',
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Hoodi,
  ],
  isAutoConnect: true,
  isAddTokenEnabled: false,
  fallbackProvider: () => window.ethereum?.isLedgerLive ? window.ethereum : null,
})


export default ledgerLive
