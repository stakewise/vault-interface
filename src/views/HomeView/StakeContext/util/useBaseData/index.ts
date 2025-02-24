import { useEffect, useCallback, useMemo } from 'react'
import notifications from 'sw-modules/notifications'
import { useStore, useObjectState } from 'hooks'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import methods from 'sw-methods'

import boost from '../boost'
import stake from '../stake'
import useAPY from './useAPY'
import useStats from './useStats'
import useMintTokenBalance from './useMintTokenBalance'


const initialState: Omit<StakePage.Data, 'refetchData'> = {
  users: 0,
  ltvPercent: 0n,
  tvl: methods.formatApy(0),
  fee: methods.formatApy(0),
  apy: {
    user: 0,
    vault: 0,
    maxBoost: 0,
    mintToken: 0,
  },
  boost: {
    shares: 0n,
    rewardAssets: 0n,
    exitingPercent: 0,
    maxMintShares: 0n,
    isProfitable: false,
  },
  mintTokenBalance: 0n,
  stakedAssets: 0n,
  isFetching: true,
}

export const baseDataMock: StakePage.Data = {
  ...initialState,
  refetchData: () => Promise.resolve(),
}

const storeSelector = (store: Store) => ({
  isMintTokenFetching: store.mintToken.isFetching,
})

const useBaseData = (vaultAddress: string) => {
  const { isMintTokenFetching } = useStore(storeSelector)
  const { autoConnectChecked, isChainChanged } = useConfig()

  const [ state, setState ] = useObjectState(initialState)

  const fetchStats = useStats()
  const fetchAPY = useAPY(vaultAddress)
  const fetchBoost = boost.useData(vaultAddress)
  const fetchStake = stake.useBalance(vaultAddress)
  const fetchMintTokenBalance = useMintTokenBalance()

  const fetchData = useCallback(async () => {
    try {
      setState({ isFetching: true })

      const mintTokenBalance = await fetchMintTokenBalance()

      const [ apyData, stats, boost, stakedAssets ] = await Promise.all([
        fetchAPY(),
        fetchStats(),
        fetchBoost(mintTokenBalance),
        fetchStake(mintTokenBalance),
      ])

      const { tvl, users } = stats
      const { apy, fee, ltvPercent } = apyData

      setState({
        apy,
        fee,
        tvl,
        boost,
        users,
        ltvPercent,
        stakedAssets,
        mintTokenBalance,
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
  }, [
    setState,
    fetchAPY,
    fetchStake,
    fetchStats,
    fetchBoost,
    fetchMintTokenBalance,
  ])

  useEffect(() => {
    if (isChainChanged) {
      setState(initialState)
    }

    if (autoConnectChecked) {
      fetchData()
    }
  }, [ autoConnectChecked, isChainChanged, fetchData, setState ])

  const isFetching = isMintTokenFetching || state.isFetching

  return useMemo<StakePage.Data>(() => ({
    ...state,
    isFetching,
    refetchData: fetchData,
  }), [
    state,
    isFetching,
    fetchData,
  ])
}


export default useBaseData
