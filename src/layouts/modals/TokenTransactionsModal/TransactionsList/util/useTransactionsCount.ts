import { useEffect, useMemo } from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'
import cacheStorage from 'sw-modules/cache-storage'

// import { useTokenHoldersQuery, getTokenTransfersQueryCache } from 'graphql/subgraph/tokenTransfers'
// import type { TokenHoldersQueryPayload } from 'graphql/subgraph/tokenTransfers'


type Output = {
  transactionsCount: number
  isFetching: boolean
}

type Input = {
  token: string
}

const modifyTokenHolder = ({ swiseTokenHolders, osTokenHolders }: TokenHoldersQueryPayload) => ({
  [constants.tokens.swise]: Number(swiseTokenHolders[0]?.transfersCount || 0),
  [constants.tokens.osToken]:  Number(osTokenHolders[0]?.transfersCount || 0),
})

const transactionsCountCache = cacheStorage.get<Record<string, number>>(UNIQUE_FILE_ID)

const useTransactionsCount = ({ token }: Input): Output => {
  const { sdk, address } = useConfig()

  // const { data: counts, isFetching: isTokenHolderFetching } = useTokenHoldersQuery({
  //   urls: sdk.config.api,
  //   variables: {
  //     address: address?.toLowerCase() as string,
  //   },
  //   pause: !address,
  //   modifyResult: modifyTokenHolder,
  // })

  const isTokenHolderFetching = false
  const counts = modifyTokenHolder({ swiseTokenHolders: [], osTokenHolders: [] })

  useEffect(() => {
    if (counts && address) {
      const total = Object.values(counts).reduce((acc, count) => acc + count, 0)

      const cachedTotal = transactionsCountCache.getData()?.[address]
      const isCountUpdated = typeof cachedTotal === 'number' && cachedTotal !== total

      if (isCountUpdated) {
        const transfersCache = getTokenTransfersQueryCache(sdk.config.api.subgraph)

        transfersCache.resetData()
      }

      transactionsCountCache.setData((data) => ({
        ...data,
        [address]: total,
      }))
    }
  }, [ sdk, address, counts ])

  return useMemo(() => ({
    transactionsCount: counts?.[token as keyof typeof counts] || 0,
    isFetching: isTokenHolderFetching,
  }), [ token, counts, isTokenHolderFetching ])
}


export default useTransactionsCount
