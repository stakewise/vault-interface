import { Contract, JsonRpcProvider, parseEther, toBeHex } from 'ethers'

import { chains } from '../chains'
import type { SupportedNetwork } from '../chains'
import { impersonate } from './impersonate'
import type { State } from '../init'


type Input = {
  token: string
  amount: bigint
  chainId?: SupportedNetwork
}

export type Balance = (input: Input) => Promise<void>

const transferAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

type Wrapper = (deps: { state: State }) => Balance

const holderEthHex = toBeHex(parseEther('100000'))

export const createBalance: Wrapper = ({ state }) => (
  async ({ token, amount, chainId }) => {
    if (!state.address) {
      throw new Error('Wallet not initialized - call wallet.init() first')
    }

    const targetChainId = chainId || state.chainId
    const chainEntry = chains[targetChainId]
    const holder = chainEntry.holders[token]

    if (!holder) {
      throw new Error(
        `No known holder for token ${token} on chain ${targetChainId}. ` +
        `Add it to chains.ts holders map.`
      )
    }

    const rpc = new JsonRpcProvider(chainEntry.rpcUrl)

    try {
      await impersonate({ rpc, rpcUrl: chainEntry.rpcUrl, address: holder })
      await rpc.send('anvil_setBalance', [ holder, holderEthHex ])

      const signer = await rpc.getSigner(holder)
      const contract = new Contract(token, transferAbi, signer)

      try {
        const tx = await contract.transfer(state.address, amount)

        await rpc.waitForTransaction(tx.hash, 1, 30_000)
      }
      catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        throw new Error(
          `balance: transfer failed (token=${token}, holder=${holder}, recipient=${state.address}, chainId=${targetChainId}): ${message}`,
          { cause: error }
        )
      }
    }
    finally {
      rpc.destroy()
    }
  }
)
