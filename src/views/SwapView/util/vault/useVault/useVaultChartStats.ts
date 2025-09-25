import { useCallback, useMemo } from 'react'
import { useActions, useMountedRef } from 'hooks'
import { useConfig } from 'config'


const useVaultChartStats = (vaultAddress: string) => {
  const { sdk } = useConfig()
  const actions = useActions()
  const mountedRef = useMountedRef()

  const fetchVaultChartStats = useCallback(async (daysCount: number) => {
    try {
      actions.vault.chart.setFetching(true)

      const data = await sdk.vault.getVaultStats({
        vaultAddress,
        daysCount,
      })

      if (mountedRef.current) {
        actions.vault.chart.setData(data)
      }
    }
    catch (error: any) {
      console.error('Fetch vault stats collection fail', error)

      actions.vault.chart.setFetching(false)
    }
  }, [ vaultAddress, sdk, actions, mountedRef ])

  const resetVaultChartStats = useCallback(() => {
    actions.vault.chart.resetData()
  }, [ actions ])

  return useMemo(() => ({
    fetchVaultChartStats,
    resetVaultChartStats,
  }), [
    fetchVaultChartStats,
    resetVaultChartStats,
  ])
}


export default useVaultChartStats
