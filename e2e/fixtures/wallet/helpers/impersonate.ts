import type { JsonRpcProvider } from 'ethers'


type Input = {
  rpc: JsonRpcProvider
  rpcUrl: string
  address: string
}

const cache: Record<string, Record<string, true>> = {}

export const impersonate = async ({ rpc, rpcUrl, address }: Input) => {
  const addressKey = address.toLowerCase()

  if (!cache[rpcUrl]) {
    cache[rpcUrl] = {}
  }

  if (cache[rpcUrl][addressKey]) {
    return
  }

  await rpc.send('anvil_impersonateAccount', [ address ])

  cache[rpcUrl][addressKey] = true
}

export const clearImpersonatedCache = (rpcUrl: string) => {
  delete cache[rpcUrl]
}
