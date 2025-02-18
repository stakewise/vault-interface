import cacheStorage from 'sw-modules/cache-storage'
import { Network } from 'sdk'


type EnsCache = Record<string, string | null>

type Cache = Record<string, EnsCache>

const ensNamesCache = cacheStorage.get<Cache>(UNIQUE_FILE_ID)

type GetCachedAddressInput = {
  chainId: Network
  ensName: string
}

const getCachedAddress = ({ chainId, ensName }: GetCachedAddressInput) => {
  const cache = ensNamesCache.getData()?.[chainId] || {}

  return Object.keys(cache).find((address) => (
    cache[address] === ensName
  ))
}

type GetCachedNameInput = {
  chainId: Network
  address: string
}

const getCachedName = ({ chainId, address }: GetCachedNameInput) => {
  return ensNamesCache.getData()?.[chainId]?.[address]
}


export {
  ensNamesCache,
  getCachedName,
  getCachedAddress,
}
