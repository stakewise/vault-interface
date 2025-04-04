import { useCallback, useEffect, useMemo } from 'react'
import { constants } from 'helpers'

import useObjectState from 'hooks/controls/useObjectState'


type Input = {
  ltvPercent: bigint
  skip?: boolean
}

// TODO We'll be getting from our subgraph later.
const borrowLtv = 930000000000000000n

// Boost works with Aave, and it's called “reserve”. Reserve has a limit on the number of deposits,
// we should check this limit as transactions will fall if the limit is reached
// One reserve is used for all vaults that have boost logic.

const useBoostSupplyCapsCheck = (values: Input) => {
  const { ltvPercent, skip } = values

  const [ state, setState ] = useObjectState({
    isFetching: !skip,
    hasError: false,
    supplyDiff: 0n,
  })

  const fetchSupplyDiff = useCallback(async () => {
    try {
      const response = await fetch('https://app.stakewise.io/api/boost-supply-diff')

      if (response?.status !== 200) {
        throw new Error('checkSupplyCap: Failed to request data from aave')
      }

      const result = await response.json() as string

      const supplyDiff = BigInt(result)

      setState({
        supplyDiff,
        isFetching: false,
      })
    }
    catch (error) {
      console.error('Fetch supply diff error', error as Error)

      setState({
        isFetching: false,
        hasError: true,
      })
    }
  }, [ setState ])

  const checkSupplyCap = useCallback((value: bigint) => {
    if (!value) {
      return true
    }

    if (state.isFetching) {
      console.error('checkSupplyCap: Insufficient data for calculations')

      return true
    }

    if (state.hasError) {
      console.error('checkSupplyCap: Failed to request data from aave')

      return true
    }

    const amount1 = constants.blockchain.amount1
    const totalLtv = BigInt(ltvPercent) * borrowLtv / amount1
    const totalSupplied = value * amount1 / (amount1 - totalLtv)

    return state.supplyDiff > totalSupplied
  }, [ state, ltvPercent ])

  useEffect(() => {
    if (skip) {
      return
    }

    fetchSupplyDiff()
  }, [ skip ])

  return useMemo(() => ({
    checkSupplyCap,
    isFetching: state.isFetching,
  }), [ state, checkSupplyCap ])
}


export default useBoostSupplyCapsCheck
