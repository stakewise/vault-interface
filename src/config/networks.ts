import { mainnet, hoodi, gnosis } from 'viem/chains'
import { chains, Network } from 'sdk'
import apiUrls from 'helpers/methods/apiUrls'


const defaultNetworks: Record<Network, ConfigProvider.SupportedNetwork> = {
  [Network.Mainnet]: {
    ...chains.mainnet,
    viem: mainnet,
    logo: 'token/ETH',
    rpc: apiUrls.getWeb3Url(Network.Mainnet) as string | string[],
  },
  [Network.Gnosis]: {
    ...chains.gnosis,
    viem: gnosis,
    logo: 'token/GNO',
    rpc: apiUrls.getWeb3Url(Network.Gnosis) as string | string[],
  },
  [Network.Hoodi]: {
    ...chains.hoodi,
    viem: hoodi,
    logo: 'token/ETH',
    rpc: apiUrls.getWeb3Url(Network.Hoodi) as string | string[],
  },
}

const configs = {} as Record<string, ConfigProvider.SupportedNetwork>
const chainById = {} as Record<string, number>
const idByChain = {} as Record<number, string>

Object.values(defaultNetworks).forEach((config) => {
  const { id, chainId } = config

  configs[id] = config
  chainById[id] = chainId
  idByChain[chainId] = id
})

const networks: ConfigProvider.Networks = {
  default: defaultNetworks,
  chainById,
  idByChain,
  configs,
}


export default networks
