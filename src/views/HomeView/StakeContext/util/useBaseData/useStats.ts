import { useCallback } from 'react'
import { useConfig } from 'config'
import methods from 'sw-methods'


const useStats = () => {
  const { sdk } = useConfig()

  return useCallback(async () => {
    try {
      const stats = await sdk.utils.getStakewiseStats()

      const token = sdk.config.tokens.depositToken
      const value = methods.formatTokenValue(BigInt(stats.totalAssets))
      const tvl = `${value} ${token}`
      const users = stats.usersCount

      return {
        tvl,
        users,
      }
    }
    catch (error) {
      console.error('Stake: fetchStats error', error as Error)
      return Promise.reject('Stake: fetchStats error')
    }
  }, [ sdk ])
}


export default useStats
