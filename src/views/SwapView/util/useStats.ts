import { useCallback, useEffect } from 'react'
import { useObjectState } from 'hooks'
import { StakeWiseSDK } from 'sdk'
import { useConfig } from 'config'
import { methods } from 'helpers'


type State = {
  tvl: string
  isStatsFetching: boolean
}

type Stats = Awaited<ReturnType<StakeWiseSDK['utils']['getStakewiseStats']>>

const useStats = () => {
  const { sdk } = useConfig()

  const [ state, setState ] = useObjectState<State>({
    isStatsFetching: true,
    tvl: '',
  })

  const fetchStats = useCallback(async () => {
    try {
      const mockE2E = methods.insertMockE2E<Stats>('fixtures/swap/setSwapStats')

      const stats = mockE2E ? mockE2E : await sdk.utils.getStakewiseStats()

      const token = sdk.config.tokens.depositToken
      const value = methods.formatTokenValue(BigInt(stats.totalAssets))
      const tvl = `${value} ${token}`

      setState({
        tvl,
        isStatsFetching: false,
      })
    }
    catch (error) {
      console.error('Stake: fetchStats error:', error)

      setState({ isStatsFetching: false })

      return Promise.reject('Stake: fetchStats error')
    }
  }, [ sdk, setState ])

  useEffect(() => {
    fetchStats()
  }, [ fetchStats ])

  return state
}


export default useStats
