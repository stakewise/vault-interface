import { useMemo } from 'react'
import { useStore } from 'hooks'

import { Tab, Type } from './enums'
import useUserStats from './useUserStats'
import useVaultStats from './useVaultStats'


const storeSelector = (store: Store) => ({
  vaultData: store.vault.chart.data,
  userData: store.vault.user.rewards.data,
  isUserDataFetching: store.vault.user.rewards.isFetching,
  isVaultDataFetching: store.vault.chart.isFetching,
})

type Output = {
  points: Charts.MainData
  isFetching: boolean
  isExportVisible: boolean
}

type Input = {
  tab: Tab
  type: Type
  days: number
}

const useChartPoints = ({ tab, type, days }: Input): Output => {
  const { vaultData, userData, isUserDataFetching, isVaultDataFetching } = useStore(storeSelector)

  useUserStats(days)
  useVaultStats(days)

  const modifiedVaultData = useMemo(() => {
    return vaultData
      .map((item) => {
        let value = item.rewards

        if (type === Type.APY) {
          value = item.apy
        }

        if (type === Type.Balance) {
          value = item.balance
        }

        return {
          value,
          time: item.time,
        }
      })
      .reverse()
  }, [ type, vaultData ])

  const modifiedUserData = useMemo(() => {
    if (type === Type.APY) {
      return userData.apy
    }
    if (type === Type.Balance) {
      return userData.balance
    }

    return userData.rewards
  }, [ type, userData ])

  const data = tab === Tab.User ? modifiedUserData : modifiedVaultData
  const isFetching = tab === Tab.User ? isUserDataFetching : isVaultDataFetching

  return useMemo(() => ({
    points: [
      {
        data,
      },
    ],
    isExportVisible: tab === Tab.User && type === Type.Rewards && Boolean(data.length),
    isFetching,
  }), [ tab, type, data, isFetching ])
}


export default useChartPoints
