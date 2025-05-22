import { coinbaseWallet } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'


class CoinbaseConnector extends WagmiConnector {
  constructor(chainId: ChainIds) {
    const creator = coinbaseWallet({
      appLogoUrl: 'https://app.stakewise.io/logo512.png',
      enableMobileWalletLink: true,
      appName: 'StakeWise',
      chainId,
    })

    super({ creator })
  }
}


export default CoinbaseConnector
