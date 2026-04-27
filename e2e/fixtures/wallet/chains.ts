export enum Network {
  Mainnet = 1,
}

export type SupportedNetwork = Network.Mainnet

type ChainHolders = Record<string, string>

export type ChainEntry = {
  name: string
  rpcUrl: string
  hexadecimalChainId: string
  defaultPrivateKey: string
  holders: ChainHolders
}

export const tokens = {
  mainnet: {
    mintToken: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
    v2StakedToken: '0xFe2e637202056d30016725477c5da089Ab0A043A',
    v2RewardToken: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
  },
}

const defaultPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const ethereumHolders: ChainHolders = {
  [tokens.mainnet.mintToken]: '0x927709711794F3De5DdBF1D176bEE2D55Ba13c21',
  [tokens.mainnet.v2StakedToken]: '0x0A2504b0B4a9d08b699BeaA72D53F0267bCFfFbb',
  [tokens.mainnet.v2RewardToken]: '0x0A2504b0B4a9d08b699BeaA72D53F0267bCFfFbb',
}

export const chains: Record<SupportedNetwork, ChainEntry> = {
  [Network.Mainnet]: {
    defaultPrivateKey,
    name: 'Ethereum',
    hexadecimalChainId: '0x1',
    rpcUrl: 'http://127.0.0.1:8545',
    holders: ethereumHolders,
  },
}

export const defaultChainId: SupportedNetwork = Network.Mainnet

export const getAvailableChains = () => {
  const entries = Object.values(chains).map((entry) => [
    entry.hexadecimalChainId,
    { rpcUrl: entry.rpcUrl, name: entry.name },
  ])

  return Object.fromEntries(entries)
}
