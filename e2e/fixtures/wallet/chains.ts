import { configs, Network } from '@stakewise/v3-sdk'


const mainnetTokens = configs[Network.Mainnet].addresses.tokens

type ChainHolders = Record<string, string>

export type SupportedNetwork = Network.Mainnet | Network.Gnosis

export type ChainEntry = {
  name: string
  rpcUrl: string
  defaultPrivateKey: string
  holders: ChainHolders
}

const defaultPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const ethereumHolders: ChainHolders = {
  [mainnetTokens.mintToken]: '0x927709711794F3De5DdBF1D176bEE2D55Ba13c21',
  [mainnetTokens.v2StakedToken]: '0x0A2504b0B4a9d08b699BeaA72D53F0267bCFfFbb',
  [mainnetTokens.v2RewardToken]: '0x0A2504b0B4a9d08b699BeaA72D53F0267bCFfFbb',
}

const gnosisHolders: ChainHolders = {}

export const chains: Record<SupportedNetwork, ChainEntry> = {
  [Network.Mainnet]: {
    defaultPrivateKey,
    name: configs[Network.Mainnet].network.name,
    rpcUrl: 'http://127.0.0.1:8545',
    holders: ethereumHolders,
  },
  [Network.Gnosis]: {
    defaultPrivateKey,
    name: configs[Network.Gnosis].network.name,
    rpcUrl: 'http://127.0.0.1:8546',
    holders: gnosisHolders,
  },
}

export const defaultChainId: SupportedNetwork = Network.Mainnet

export const getAvailableChains = () => {
  const entries = Object.entries(chains).map(([ id, entry ]) => {
    const chainId = Number(id) as SupportedNetwork

    return [
      configs[chainId].network.hexadecimalChainId,
      { rpcUrl: entry.rpcUrl, name: entry.name },
    ]
  })

  return Object.fromEntries(entries)
}
