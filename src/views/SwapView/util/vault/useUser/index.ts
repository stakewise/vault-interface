import { useCallback, useMemo, useEffect } from 'react'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import useBalances from './useBalances'
import useUnstakeQueue from './useUnstakeQueue'
import useUnboostQueue from './useUnboostQueue'
import useUserChartStats from './useUserChartStats'


type Input = {
  withBalances?: boolean
  withUnstakeQueue?: boolean
  withUnboostQueue?: boolean
  withUserChartStats?: boolean
}

const storeSelector = (store: Store) => ({
  isVaultFetching: store.vault.base.isFetching,
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useUser = (values: Input) => {
  const {
    withBalances = true,
    withUnstakeQueue = true,
    withUnboostQueue = true,
    withUserChartStats = true,
  } = values

  const { address, autoConnectChecked } = useConfig()
  const { vaultAddress, isVaultFetching } = useStore(storeSelector)

  const { fetchBalances, resetBalances } = useBalances(vaultAddress)
  const { fetchUnstakeQueue, resetUnstakeQueue } = useUnstakeQueue(vaultAddress)
  const { fetchUnboostQueue, resetUnboostQueue } = useUnboostQueue(vaultAddress)
  const { fetchUserChartStats, resetUserChartStats } = useUserChartStats(vaultAddress)

  const fetchAllUserData = useCallback(async () => {
    const requests: Promise<void>[] = []

    if (!address || !autoConnectChecked || isVaultFetching || !vaultAddress) {
      return
    }

    if (withBalances) {
      requests.push(fetchBalances())
    }

    if (withUnstakeQueue) {
      requests.push(fetchUnstakeQueue())
    }

    if (withUnboostQueue) {
      requests.push(fetchUnboostQueue())
    }

    if (withUserChartStats) {
      requests.push(fetchUserChartStats(30))
    }

    return Promise.all(requests)
  }, [
    address,
    vaultAddress,
    withBalances,
    isVaultFetching,
    withUnstakeQueue,
    withUnboostQueue,
    withUserChartStats,
    autoConnectChecked,
    fetchBalances,
    fetchUnstakeQueue,
    fetchUnboostQueue,
    fetchUserChartStats,
  ])

  const resetAllUserData = useCallback(() => {
    resetBalances()
    resetUnstakeQueue()
    resetUnboostQueue()
    resetUserChartStats()
  }, [
    resetBalances,
    resetUnstakeQueue,
    resetUnboostQueue,
    resetUserChartStats,
  ])

  useEffect(() => {
    if (!address && autoConnectChecked) {
      resetAllUserData()
    }
  }, [ address, autoConnectChecked, resetAllUserData ])

  return useMemo(() => ({
    fetchAllUserData,
    resetAllUserData,

    fetchBalances,
    fetchUnstakeQueue,
    fetchUnboostQueue,

    fetchUserChartStats,
  }), [
    fetchAllUserData,
    resetAllUserData,

    fetchBalances,
    fetchUnstakeQueue,
    fetchUnboostQueue,
    fetchUserChartStats,
  ])
}


export default useUser
