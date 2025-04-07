import { Network } from 'sdk'

import { ensNamesCache, getCachedAddress } from './ensCache'


type Input = {
  chainId: Network
  provider: StakeWise.Provider
  ensName: string
}

const fetchAddress = async ({ chainId, provider, ensName }: Input) => {
  if (chainId === Network.Hoodi) {
    return null
  }

  const cachedAddress = getCachedAddress({ chainId, ensName })

  if (typeof cachedAddress !== 'undefined') {
    return cachedAddress
  }

  try {
    const address = await provider.resolveName(ensName)

    if (address) {
      ensNamesCache.setData((data) => ({
        ...data,
        [chainId]: {
          ...data?.[chainId],
          [address]: ensName,
        },
      }))

      return address
    }
  }
  catch (error) {
    console.error('Failed to fetch ENS', error)
  }

  return null
}


export default fetchAddress
