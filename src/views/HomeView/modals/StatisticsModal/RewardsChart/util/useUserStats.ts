import { useCallback, useEffect, useMemo, useRef } from 'react'
import methods from 'sw-methods'
import { useConfig } from 'config'
import { useObjectState } from 'hooks'
import { calculateUserStats, getTimestamp } from 'sdk'

import { Type } from './enums'


type StakeStatsQueryPayload = {
  osTokenHolder: {
    apy: number
    timestamp: string
    totalAssets: string
    earnedAssets: string
  }[]
}

type StakeStatsVariables = {
  first: number
  where: {
    osTokenHolder: string
    timestamp_gte?: number
  }
}

type Input = {
  type: Type
  days: number
}

type Output = {
  data: Charts.Point[]
  isFetching: boolean
  isExportVisible: boolean
}

type State = {
  apy: Charts.Point[]
  rewards: Charts.Point[]
  balance: Charts.Point[]
  isFetching: boolean
  isExportVisible: boolean
}

const initialState = {
  apy: [],
  rewards: [],
  balance: [],
  isFetching: true,
  isExportVisible: false,
}

const useUserStats = (input: Input): Output => {
  const { days, type } = input

  const { sdk, address, autoConnectChecked } = useConfig()

  const cache = useRef<Record<number, State>>({})

  const [ state, setState ] = useObjectState<State>({
    ...initialState,
    isFetching: Boolean(address),
  })

  const fetchRewards = useCallback(async (days = 30) => {
    if (!address) {
      setState({
        ...initialState,
        isFetching: false,
      })

      return
    }

    if (cache.current[days]) {
      setState(cache.current[days])

      return
    }

    setState({ isFetching: true })

    const timestamp = String(getTimestamp(days))

    const osTokenHolderId = address.toLowerCase()

    const fetchStakeStats = (variables: StakeStatsVariables) => {
      return methods.fetch<StakeStatsQueryPayload>(sdk.config.api.subgraph, {
        method: 'POST',
        body: JSON.stringify({
          query: `
            query StakeStats(
              $where: OsTokenHolderStats_filter
              $first: Int
            ) {
              osTokenHolder: osTokenHolderStats_collection(
                interval: day
                first: $first
                where: $where
              ) {
                apy
                timestamp
                totalAssets
                earnedAssets
              }
            }
          `,
          variables,
        }),
      })
    }

    const [ timestampResult, firstResult ] = await Promise.all([
      fetchStakeStats({
        first: days,
        where: {
          osTokenHolder: osTokenHolderId,
          timestamp_gte: timestamp,
        },
      }),
      fetchStakeStats({
        first: 1,
        where: {
          osTokenHolder: osTokenHolderId,
        },
      }),
    ])

    const userStats = calculateUserStats(timestampResult.osTokenHolder)

    const newState = {
      ...userStats,
      isFetching: false,
      isExportVisible: Boolean(firstResult.osTokenHolder.length),
    }

    setState(newState)

    cache.current[days] = newState
  }, [ sdk, address, setState ])

  useEffect(() => {
    if (address && autoConnectChecked) {
      fetchRewards(days)
    }
  }, [ address, autoConnectChecked, fetchRewards, days ])

  return useMemo(() => {
    const getPointsByType = () => {
      if (type === Type.APY) {
        return state.apy
      }
      else if (type === Type.Balance) {
        return state.balance
      }

      return state.rewards
    }

    return ({
      data: getPointsByType(),
      isFetching: state.isFetching,
      isExportVisible: state.isExportVisible,
    })
  }, [ state, type ])
}


export default useUserStats
