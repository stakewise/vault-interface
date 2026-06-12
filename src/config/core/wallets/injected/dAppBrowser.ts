import { Network } from 'sdk'

import { createInjectedWallet } from './helpers'


const dAppBrowser = createInjectedWallet({
  id: 'dAppBrowser',
  title: 'DApp Browser',
  logo: 'connector/monitorAddress',
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Hoodi,
  ],
  location: [ 'mobile' ],
  isAutoConnect: true,
  isAddTokenEnabled: false,
  isLocalStorageSave: false,
  fallbackProvider: () => window.ethereum,
})


export default dAppBrowser
