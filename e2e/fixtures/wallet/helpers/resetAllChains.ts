import { JsonRpcProvider } from 'ethers'

import { chains, Network } from '../chains'
import type { SupportedNetwork } from '../chains'
import { impersonate, clearImpersonatedCache } from './impersonate'


const forkUrls: Record<SupportedNetwork, string | undefined> = {
  [Network.Mainnet]: process.env.RPC_URL,
}

const rpcTimeoutMs = 30_000

const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => (
  Promise.race([
    promise,
    new Promise<never>((_, reject) => (
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    )),
  ])
)

const resetChain = async (chainId: SupportedNetwork) => {
  const chainEntry = chains[chainId]
  const forkUrl = forkUrls[chainId]

  if (!forkUrl) {
    throw new Error(`Fork URL missing for chain ${chainId} - set RPC_URL in CI secrets`)
  }

  const rpc = new JsonRpcProvider(chainEntry.rpcUrl)

  try {
    await withTimeout(
      rpc.send('anvil_reset', [ { forking: { jsonRpcUrl: forkUrl } } ]),
      rpcTimeoutMs,
      `anvil_reset chain=${chainId}`
    )

    clearImpersonatedCache(chainEntry.rpcUrl)

    for (const holder of Object.values(chainEntry.holders)) {
      try {
        await impersonate({ rpc, rpcUrl: chainEntry.rpcUrl, address: holder })
      }
      catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        console.warn(`[anvil.reset] impersonate ${holder} on chain ${chainId} failed: ${message}`)
      }
    }
  }
  finally {
    rpc.destroy()
  }
}

export const resetAllChains = async () => {
  const ids = Object.keys(chains).map((id) => Number(id) as SupportedNetwork)

  await Promise.all(ids.map(resetChain))
}
