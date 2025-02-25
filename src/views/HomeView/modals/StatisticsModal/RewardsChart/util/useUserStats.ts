import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useConfig } from 'config'
import { useObjectState } from 'hooks'
import { calculateUserStats, getTimestamp } from 'sdk'
// import { fetchStakeStatsQuery } from 'graphql/subgraph/swap' // TODO replace with sdk

import { Type } from './enums'


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

    // const timestamp = String(getTimestamp(days))
    //
    // const osTokenHolderId = address.toLowerCase()
    //
    // const [ timestampResult, firstResult ] = await Promise.all([
    //   fetchStakeStatsQuery({
    //     url: sdk.config.api.subgraph,
    //     requestPolicy: 'no-cache',
    //     variables: {
    //       first: days,
    //       where: {
    //         osTokenHolder: osTokenHolderId,
    //         timestamp_gte: timestamp,
    //       },
    //     },
    //   }),
    //   fetchStakeStatsQuery({
    //     url: sdk.config.api.subgraph,
    //     requestPolicy: 'no-cache',
    //     variables: {
    //       first: 1,
    //       where: {
    //         osTokenHolder: osTokenHolderId,
    //       },
    //     },
    //   }),
    // ])
    //
    // const userStats = calculateUserStats(timestampResult.osTokenHolder)
    //
    // const newState = {
    //   ...userStats,
    //   isFetching: false,
    //   isExportVisible: Boolean(firstResult.osTokenHolder.length),
    // }
    //
    // setState(newState)
    //
    // cache.current[days] = newState
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
