import { useEffect, useCallback, useMemo } from 'react'
import { useObjectState } from 'hooks'
import notifications from 'sw-modules/notifications'
import { commonMessages } from 'helpers'
import methods from 'sw-methods'

import useAPY from './useAPY'
import useStats from './useStats'
import useUserRewards from './useUserRewards'


const initialState: Omit<StakePage.Data, 'refetchData'> = {
  users: 0,
  ltvPercent: 0n,
  tvl: methods.formatApy(0),
  fee: methods.formatApy(0),
  userRewards: 0n,
  isFetching: true,
  apy: {
    user: 0,
    vault: 0,
    maxBoost: 0,
    mintToken: 0,
  },
}

export const baseDataMock: StakePage.Data = {
  ...initialState,
  refetchData: () => Promise.resolve(),
}

const useBaseData = (vaultAddress: string) => {
  const [ state, setState ] = useObjectState(initialState)

  const fetchAPY = useAPY(vaultAddress)
  const fetchStats = useStats()
  const fetchUserRewards = useUserRewards(vaultAddress)

  const fetchData = useCallback(async () => {
    try {
      const [ apyData, stats, userRewards ] = await Promise.all([
        fetchAPY(),
        fetchStats(),
        fetchUserRewards(),
      ])

      const { tvl, users } = stats
      const { apy, fee, ltvPercent } = apyData

      setState({
        apy,
        tvl,
        fee,
        users,
        ltvPercent,
        userRewards,
        isFetching: false,
      })
    }
    catch (error) {
      console.log({ error })
      notifications.open({
        text: commonMessages.notification.somethingWentWrong,
        type: 'error',
      })
    }
    finally {
      setState({ isFetching: false })
    }
  }, [ fetchAPY, fetchStats, fetchUserRewards, setState ])

  useEffect(() => {
    fetchData()
  }, [ fetchData ])

  return useMemo<StakePage.Data>(() => ({
    ...state,
    refetchData: fetchData,
  }), [
    state,
    fetchData,
  ])
}


export default useBaseData
