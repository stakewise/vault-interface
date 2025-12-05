import { useCallback, useMemo } from 'react'
import { useActions, useMountedRef } from 'hooks'
import { useConfig } from 'config'
import { requests } from 'helpers'


const useUserChartStats = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { sdk, address } = useConfig()

  const fetchUserChartStats = useCallback(async (daysCount: number) => {
    try {
      if (address) {
        actions.vault.user.rewards.setFetching(true)

        const data = await requests.user.fetchUserRewards({
          sdk,
          vaultAddress,
          days: daysCount,
          userAddress: address,
        })

        if (mountedRef.current) {
          actions.vault.user.rewards.setData(data)
        }
      }
    } catch (error: any) {
      console.error('Fetch user chart stats fail', error)

      actions.vault.user.rewards.setFetching(false)
    }
  }, [ actions, address, sdk, vaultAddress, mountedRef ])

  const resetUserChartStats = useCallback(() => {
    actions.vault.user.rewards.resetData()
  }, [ actions ])

  return useMemo(() => ({
    fetchUserChartStats,
    resetUserChartStats,
  }), [
    fetchUserChartStats,
    resetUserChartStats,
  ])
}


export default useUserChartStats
