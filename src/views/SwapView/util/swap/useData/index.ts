import { useCallback, useMemo } from 'react'
import { useConfig } from 'config'
import { useStore, useBalances, useAutoFetch, useChainChanged } from 'hooks'

import useSwapTokenRates from './useSwapTokenRates'


const storeSelector = (store: Store) => ({
  swapTokenRates: store.swapTokenRates.data,
  swapTokenBalances: store.account.swapTokenBalances.data,
  isRatesFetching: store.swapTokenRates.isFetching,
  isBalancesFetching: store.account.swapTokenBalances.isFetching,
})

type Input = {
  skip?: boolean
}

const useData = (values?: Input) => {
  const { skip } = values || {}

  const { address } = useConfig()
  const { swapTokenRates, swapTokenBalances, isRatesFetching, isBalancesFetching } = useStore(storeSelector)

  const isFetched = useMemo(() => {
    const isBalancesFetched = Object.keys(swapTokenBalances).length > 0
    const isRatesFetched = Object.keys(swapTokenRates).some((token) => swapTokenRates[token].USD)

    if (!address) {
      return isRatesFetched
    }

    return isRatesFetched && isBalancesFetched
  }, [ address, swapTokenRates, swapTokenBalances ])

  const fetchRates = useSwapTokenRates()
  const { refetchSwapTokenBalances } = useBalances()

  const handleFetch = useCallback(async () => {
    if (!skip) {
      await Promise.all([
        refetchSwapTokenBalances(),
        fetchRates(),
      ])
    }
  }, [ skip, fetchRates, refetchSwapTokenBalances ])

  useChainChanged(handleFetch)

  useAutoFetch({
    action: handleFetch,
    interval: 15 * 60 * 1000,
    skip,
  })

  const isFetching = isRatesFetching || isBalancesFetching

  return useMemo(() => ({
    isFetching: isFetching && !isFetched,
  }), [
    isFetching,
    isFetched,
  ])
}


export default useData
