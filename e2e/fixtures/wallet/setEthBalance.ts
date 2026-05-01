import { JsonRpcProvider, toBeHex } from 'ethers'

import { chains } from './chains'
import type { SupportedNetwork } from './chains'
import type { State } from './init'


type Input = {
  amount: bigint
  chainId?: SupportedNetwork
}

export type SetEthBalance = (input: Input) => Promise<void>

type Wrapper = (deps: { state: State }) => SetEthBalance

export const createSetEthBalance: Wrapper = ({ state }) => (
  async ({ amount, chainId }) => {
    if (!state.address) {
      throw new Error('Wallet not initialized - call wallet.init() first')
    }

    const targetChainId = chainId || state.chainId
    const rpc = new JsonRpcProvider(chains[targetChainId].rpcUrl)

    try {
      await rpc.send('anvil_setBalance', [ state.address, toBeHex(amount) ])
    }
    finally {
      rpc.destroy()
    }
  }
)
