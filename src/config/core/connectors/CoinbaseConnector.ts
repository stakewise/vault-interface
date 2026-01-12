import { coinbaseWallet } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'


class CoinbaseConnector extends WagmiConnector {
  constructor() {
    const creator = coinbaseWallet({
      appLogoUrl: 'https://app.stakewise.io/logo512.png',
      appName: 'StakeWise',
    })

    super({ creator })
  }
}


export default CoinbaseConnector
