import { useCallback, useEffect } from 'react'
import { useObjectState } from 'hooks'
import { useConfig } from 'config'
import { methods } from 'helpers'


type State = {
  tvl: string
  isStatsFetching: boolean
}

const useStats = () => {
  const { sdk } = useConfig()

  const [ state, setState ] = useObjectState<State>({
    isStatsFetching: true,
    tvl: '',
  })

  const fetchStats = useCallback(async () => {
    try {
      const stats = await sdk.utils.getStakewiseStats()

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
