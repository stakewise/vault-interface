import { Network } from 'sdk'

import { getAutoDetectedProviders } from '../../../providers/eip6963'

import createInjectedWallet from './createInjectedWallet'


const networks = [
  Network.Mainnet,
  Network.Gnosis,
  Network.Hoodi,
]

const getAutoDetectedWallets = (staticWallets: Record<string, any>) => {
  const staticRdns = Object.values(staticWallets)
    .map((wallet) => wallet.rdns)
    .filter(Boolean) as string[]

  const providers = getAutoDetectedProviders()

  return providers
    .filter((detail) => !staticRdns.includes(detail.info.rdns))
    .map((detail) => createInjectedWallet({
      networks,
      id: detail.info.rdns,
      rdns: detail.info.rdns,
      title: detail.info.name,
    }))
}


export default getAutoDetectedWallets
