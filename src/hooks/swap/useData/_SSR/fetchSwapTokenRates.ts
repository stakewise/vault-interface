'use server'
import { Network } from 'sdk'
import { swapTokens, constants, methods } from 'helpers'
import cacheStorage from 'modules/cache-storage'


type CacheData = Record<string, number>
const cacheLimit = 15 * 60 * 1000 // 15 minutes

const fileId = UNIQUE_FILE_ID

const cache = {
  [Network.Mainnet]: cacheStorage.get<CacheData>(`${fileId}-${Network.Mainnet}`),
  [Network.Gnosis]: cacheStorage.get<CacheData>(`${fileId}-${Network.Gnosis}`),
}

type Input = {
  values: (number | null)[]
  chainTokens: Record<string, string>
}

const modifyResult = ({ values, chainTokens }: Input) => {
  const result: Record<string, number> = {}
  const tokenNames = Object.keys(chainTokens)

  values.forEach((value, index) => {
    const token = tokenNames[index]

    result[token] = value || 0
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

const getChainTokens = (chainId: Network) => {
  const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

  const appTokens: string[] = [
    constants.tokens.osETH,
    constants.tokens.osGNO,
    constants.tokens.swise,
  ]

  return Object.fromEntries(
    Object.entries(chainTokens).filter(([ token ]) => !appTokens.includes(token))
  )
}

const fetchSwapTokenRates = async (chainId: Network) => {
  const cacheData = cache[chainId as keyof typeof cache]?.getData()
  const chainTokens = getChainTokens(chainId)

  if (cacheData) {
    return cacheData
  }

  const values = await Promise.all(
    Object.values(chainTokens).map((address) => fetchSwapTokenRate({ chainId, address }))
  )

  const data = modifyResult({ values, chainTokens })

  cache[chainId as keyof typeof cache].setData(data, cacheLimit)

  return data
}


export default fetchSwapTokenRates
