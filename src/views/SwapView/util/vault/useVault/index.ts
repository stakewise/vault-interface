import { useCallback, useMemo } from 'react'

import useVaultData from './useVaultData'
import useVaultChartStats from './useVaultChartStats'


type Input = {
  vaultAddress: string
  withVaultData?: boolean
  withVaultChartStats?: boolean
}

const useVault = (values: Input) => {
  const {
    vaultAddress,
    withVaultData = true,
    withVaultChartStats = true,
  } = values

  const { fetchVault, resetVault } = useVaultData(vaultAddress)
  const { fetchVaultChartStats, resetVaultChartStats } = useVaultChartStats(vaultAddress)

  const fetchAllVaultData = useCallback(async () => {
    const promises: Promise<void>[] = []

    if (withVaultData) {
      promises.push(fetchVault())
    }

    if (withVaultChartStats) {
      promises.push(fetchVaultChartStats(30))
    }

    return Promise.all(promises)
  }, [
    withVaultData,
    withVaultChartStats,
    fetchVault,
    fetchVaultChartStats,
  ])

  const resetAllVaultData = useCallback(() => {
    resetVault()
    resetVaultChartStats()
  }, [
    resetVault,
    resetVaultChartStats,
  ])

  return useMemo(() => ({
    fetchAllVaultData,
    resetAllVaultData,

    fetchVault,
    fetchVaultChartStats,
  }), [
    fetchAllVaultData,
    resetAllVaultData,

    fetchVault,
    fetchVaultChartStats,
  ])
}


export default useVault
