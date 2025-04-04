import { Network } from 'sdk'

import { ensNamesCache, getCachedName } from './ensCache'


type Input = {
  chainId: Network
  provider: StakeWise.Provider
  address: string
}

const fetchName = async (props: Input) => {
  const { chainId, provider, address } = props

  const isSupported = chainId === Network.Mainnet

  if (!isSupported) {
    return null
  }

  const cachedName = getCachedName({ chainId, address })

  if (typeof cachedName !== 'undefined') {
    return cachedName
  }

  try {
    const ensName: string | null = await provider.lookupAddress(address)

    ensNamesCache.setData((data) => ({
      ...data,
      [chainId]: {
        ...data?.[chainId],
        [address]: ensName,
      },
    }))

    return ensName
  }
  catch (error) {
    console.log('catch', error)
    return null
  }
}


export default fetchName
