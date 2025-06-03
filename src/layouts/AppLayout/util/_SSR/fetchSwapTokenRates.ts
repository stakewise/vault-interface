'use server'
import methods from 'sw-methods'
import { Network } from 'sdk'
import { swapTokens } from 'helpers'
import cacheStorage from 'sw-modules/cache-storage'


type CacheData = Record<string, number>
const cacheLimit = 15 * 60 * 1000 // 15 minutes

const fileId = UNIQUE_FILE_ID

const cache = {
  [Network.Mainnet]: cacheStorage.get<CacheData>(`${fileId}-${Network.Mainnet}`),
  [Network.Gnosis]: cacheStorage.get<CacheData>(`${fileId}-${Network.Gnosis}`),
}

type Input = {
  values: (number | null)[]
  cacheData: Record<string, number> | null
  chainTokens: Record<string, string>
}

const modifyResult = ({ values, cacheData, chainTokens }: Input) => {
  const result: Record<string, number> = {}
  const tokenNames = Object.keys(chainTokens)

  values.forEach((value, index) => {
    const token = tokenNames[index]

    result[token] = value === null ? cacheData?.[token] || 0 : value
  })

  return result
}

const fetchSwapTokenRate = async ({ chainId, address }: { chainId: Network, address: string }) => {
  try {
    const url = `https://bff.cow.fi/${chainId}/tokens/${address}/usdPrice`

    const { price } = await methods.fetchWithRetry<{ price: number }>(url)

    return price || 0
  }
  catch {
    console.error('Failed to fetch rate', address)

    return null
  }
}

const fetchSwapTokenRates = async (chainId: Network) => {
  const cacheData = cache[chainId as keyof typeof cache]?.getData()
  const chainTokens: Record<string, string> | undefined = swapTokens[chainId as keyof typeof swapTokens]

  if (!chainTokens) {
    return {}
  }

  if (cacheData) {
    return cacheData
  }

  const values = await Promise.all(
    Object.values(chainTokens).map((address) => fetchSwapTokenRate({ chainId, address }))
  )

  const data = modifyResult({ values, cacheData, chainTokens })

  cache[chainId as keyof typeof cache].setData(data, cacheLimit)

  return data
}


export default fetchSwapTokenRates
