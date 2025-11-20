import { useCallback, useEffect, useMemo } from 'react'
import { useObjectState, useStore } from 'hooks'
import { constants, requests } from 'helpers'
import { useConfig } from 'config'


// TODO We'll be getting from our subgraph later.
const borrowLtv = 930000000000000000n

// Boost works with Aave, and it's called “reserve”. Reserve has a limit on the number of deposits,
// we should check this limit as transactions will fall if the limit is reached
// One reserve is used for all vaults that have boost logic.

const storeSelector = (store: Store) => ({
  ltvPercent: store.vault.base.data.osTokenConfig.ltvPercent,
  hasMintBalance: store.vault.user.balances.mintToken.hasMintBalance,
})

const useBoostSupplyCapsCheck = () => {
  const { sdk, isGnosis } = useConfig()

  const { hasMintBalance, ltvPercent } = useStore(storeSelector)

  const skip = isGnosis || !hasMintBalance // ? hasMintBalance

  const [ state, setState ] = useObjectState({
    isFetching: !skip,
    hasError: false,
    supplyDiff: 0n,
  })

  const fetchSupplyDiff = useCallback(async () => {
    try {
      const supplyDiff = await requests.fetchBoostSupplyCaps({
        url: sdk.config.api.subgraph,
      })

      if (supplyDiff === null) {
        throw new Error('Fetch supply diff error: Failed to request data')
      }

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
  }, [ sdk, setState ])

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
  }, [ skip, fetchSupplyDiff ])

  return useMemo(() => ({
    checkSupplyCap,
    isFetching: state.isFetching,
  }), [ state, checkSupplyCap ])
}


export default useBoostSupplyCapsCheck
