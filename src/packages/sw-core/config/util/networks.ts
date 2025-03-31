import { chains as sdkChains, Network } from 'sdk'


type Ids = keyof typeof supportedConfigs

// TODO This is the only link between sw-core and the SDK to keep the correct ids. But it will have to be removed
const supportedConfigs = {
  [sdkChains.gnosis.id]: sdkChains.gnosis,
  [sdkChains.chiado.id]: sdkChains.chiado,
  [sdkChains.mainnet.id]: sdkChains.mainnet,
} as const

const ids: Ids[] = []
const chains: ChainIds[] = []
const chainById: Record<Ids, Network> = {} as Record<Ids, Network>
const idByChain: Record<Network, Ids> = {} as Record<Network, Ids>

Object.values(supportedConfigs).forEach(({ id, chainId }) => {
  chains.push(chainId)
  ids.push(id)

  chainById[id] = chainId
  idByChain[chainId] = id
})

const networks = {
  configs: supportedConfigs,
  chainById,
  idByChain,
  chains,
  ids,
}


export default networks
