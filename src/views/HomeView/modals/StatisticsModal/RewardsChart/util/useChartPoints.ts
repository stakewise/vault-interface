import { useMemo } from 'react'

import { Type, Tab } from './enums'
import useUserStats from './useUserStats'
import useOsTokenStats from './useOsTokenStats'


type Input = {
  tab: Tab
  type: Type
  days: number
}

type Output = {
  points: Charts.MainData
  isFetching: boolean
  isExportVisible: boolean
}

const useChartPoints = ({ tab, type, days }: Input): Output => {
  const userStats = useUserStats({ type, days  })
  const osTokenStats = useOsTokenStats({ type, days })

  return useMemo(() => ({
    isExportVisible: userStats.isExportVisible,
    isFetching: userStats.isFetching || osTokenStats.isFetching,
    points: [
      {
        data: tab === Tab.User
          ? userStats.data
          : osTokenStats.data,
      },
    ],
  }), [ tab, userStats, osTokenStats ])
}


export default useChartPoints
