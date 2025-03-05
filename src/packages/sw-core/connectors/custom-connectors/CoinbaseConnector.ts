import { coinbaseWallet } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'


const owner = process.env.NEXT_PUBLIC_OWNER || 'StakeWise'
const domain = process.env.NEXT_PUBLIC_OWNER_DOMAIN || 'app.stakewise.io'

class CoinbaseConnector extends WagmiConnector {
  constructor(chainId: ChainIds) {
    const creator = coinbaseWallet({
      appLogoUrl: `https://${domain}/logo512.png`,
      enableMobileWalletLink: true,
      appName: owner,
      chainId,
    })

    super({ creator })
  }
}


export default CoinbaseConnector
