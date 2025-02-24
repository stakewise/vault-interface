import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useObjectState } from 'sw-hooks'
import { useConfig } from 'config'

import { Type } from './enums'


type Input = {
  type: Type
  days: number
}

type Output = {
  data: Charts.Point[]
  isFetching: boolean
}

type Stats = {
  apy: number
  time: number
  balance: number
  rewards: number
}

type State = {
  data: Stats[]
  isFetching: boolean
}

const initialState = {
  data: [],
  isFetching: true,
}

const useOsTokenStats = (input: Input): Output => {
  const { days, type } = input

  const { sdk } = useConfig()

  const cache = useRef<Record<number, State>>({})
  const [ state, setState ] = useObjectState<State>(initialState)

  const fetchStats = useCallback(async (days = 30) => {

    if (cache.current[days]) {
      setState(cache.current[days])

      return
    }

    setState({ isFetching: true })

    const osTokenStats = await sdk.osToken.getStats({
      daysCount: days,
    })

    const newState = {
      data: osTokenStats,
      isFetching: false,
    }

    setState(newState)

    cache.current[days] = newState
  }, [ sdk, setState ])

  useEffect(() => {
    fetchStats(days)
  }, [ days, fetchStats ])

  return useMemo(() => {
    const result: Charts.Point[] = state.data.map((item) => {
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

    return ({
      data: result.reverse(),
      isFetching: state.isFetching,
    })
  }, [ type, state ])
}


export default useOsTokenStats
