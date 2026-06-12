import { coinbaseWallet } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'


type Input = {
  networks: ConfigProvider.Networks
}

class CoinbaseConnector extends WagmiConnector {
  constructor({ networks }: Input) {
    const creator = coinbaseWallet({
      appLogoUrl: 'https://app.stakewise.io/logo512.png',
      appName: 'StakeWise',
    })

    super({ creator, networks })
  }
}


export default CoinbaseConnector
