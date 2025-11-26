import { configs, Network } from 'sdk'


const defaultType = 'prod'

const apiUrls = {
  [Network.Gnosis]: {
    backend: configs[Network.Gnosis].api.backend,
    web3: [
      'https://rpc.gnosis.gateway.fm',
      'https://rpc.gnosischain.com',
    ],
    subgraph: IS_PROD
      ? (process.env.NEXT_PUBLIC_GNOSIS_SUBGRAPH_URL as string || configs[Network.Gnosis].api.subgraph)
      : `https://graphs.stakewise.io/gnosis/subgraphs/name/stakewise/${defaultType}`,
  },
  [Network.Mainnet]: {
    backend: configs[Network.Mainnet].api.backend,
    web3: [
      process.env.NEXT_PUBLIC_MAINNET_NETWORK_URL || '',
      process.env.NEXT_PUBLIC_MAINNET_FALLBACK_URL || '',
    ],
    subgraph: IS_PROD
      ? configs[Network.Mainnet].api.subgraph
      : [
        `https://graphs.stakewise.io/mainnet-a/subgraphs/name/stakewise/${defaultType}`,
        `https://graphs.stakewise.io/mainnet-b/subgraphs/name/stakewise/${defaultType}`,
      ],
  },
  [Network.Chiado]: {
    backend: configs[Network.Chiado].api.backend,
    web3: 'https://rpc.chiadochain.net/',
    subgraph: IS_PROD
      ? configs[Network.Chiado].api.subgraph
      : `https://graphs.stakewise.io/chiado/subgraphs/name/stakewise/${defaultType}`,
  },
  [Network.Hoodi]: {
    backend: configs[Network.Hoodi].api.backend,
    web3: 'https://ethereum-hoodi-rpc.publicnode.com',
    subgraph: IS_PROD
      ? configs[Network.Hoodi].api.subgraph
      : `https://graphs.stakewise.io/hoodi/subgraphs/name/stakewise/${defaultType}`,
  },
} as const


export default apiUrls
