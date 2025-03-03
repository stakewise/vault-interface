import { useEffect, useCallback, useMemo } from 'react'
import { useStore, useObjectState } from 'hooks' // useTotalUserRewards
import notifications from 'sw-modules/notifications'
import { commonMessages, constants } from 'helpers'
import { useConfig } from 'config'
import methods from 'sw-methods'

// import boost from '../boost'
// import stake from '../stake'
import useAPY from './useAPY'
import useStats from './useStats'
// import useMintTokenBalance from './useMintTokenBalance'


const initialState: Omit<StakePage.Data, 'refetchData' | 'userRewards'> = {
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
  // boost: {
  //   shares: 0n,
  //   rewardAssets: 0n,
  //   exitingPercent: 0,
  //   maxMintShares: 0n,
  //   isProfitable: false,
  // },
  // mintTokenBalance: 0n,
  // stakedAssets: 0n,
  isFetching: true,
}

export const baseDataMock: StakePage.Data = {
  ...initialState,
  // userRewards: 0n,
  refetchData: () => Promise.resolve(),
}

// const storeSelector = (store: Store) => ({
//   isMintTokenFetching: store.mintToken.isFetching,
// })

const useBaseData = (vaultAddress: string) => {
  // const { networkId, autoConnectChecked } = useConfig()
  // const { isMintTokenFetching } = useStore(storeSelector)

  const [ state, setState ] = useObjectState(initialState)

  const fetchStats = useStats()
  const fetchAPY = useAPY(vaultAddress)
  // const fetchBoost = boost.useData(vaultAddress)
  // const fetchStake = stake.useBalance(vaultAddress)
  // const fetchMintTokenBalance = useMintTokenBalance()

  // const { rewards: userRewards, isFetching: isRewardsFetching } = useTotalUserRewards({
  //   // We always request the number of days from the genesis vault since it is created first
  //   vaultAddress: constants.blockchain.genesisVaultAddress[networkId],
  //   type: 'osTokenHolder',
  // })

  const fetchData = useCallback(async () => {
    try {
      const [ apyData, stats ] = await Promise.all([
        fetchAPY(),
        fetchStats(),
      ])

      const { tvl, users } = stats
      const { apy, fee, ltvPercent } = apyData

      setState({
        apy,
        tvl,
        fee,
        users,
        ltvPercent,
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
  }, [ fetchAPY, fetchStats, setState ])

  // const fetchData = useCallback(async () => {
  //   try {
  //     if (!autoConnectChecked) {
  //       return
  //     }
  //
  //     setState({ isFetching: true })
  //
  //     const mintTokenBalance = await fetchMintTokenBalance()
  //
  //     const [ apyData, stats, boost, stakedAssets ] = await Promise.all([
  //       fetchAPY(),
  //       fetchStats(),
  //       fetchBoost(mintTokenBalance),
  //       fetchStake(mintTokenBalance),
  //     ])
  //
  //     const { tvl, users } = stats
  //     const { apy, fee, ltvPercent } = apyData
  //
  //     setState({
  //       apy,
  //       fee,
  //       tvl,
  //       boost,
  //       users,
  //       ltvPercent,
  //       stakedAssets,
  //       mintTokenBalance,
  //       isFetching: false,
  //     })
  //   }
  //   catch (error) {
  //     console.log({ error })
  //     notifications.open({
  //       text: commonMessages.notification.somethingWentWrong,
  //       type: 'error',
  //     })
  //   }
  //   finally {
  //     setState({ isFetching: false })
  //   }
  // }, [
  //   autoConnectChecked,
  //   setState,
  //   fetchAPY,
  //   fetchStake,
  //   fetchStats,
  //   fetchBoost,
  //   fetchMintTokenBalance,
  // ])

  useEffect(() => {
    fetchData()
  }, [ fetchData ])

  // const isFetching = isMintTokenFetching || state.isFetching || isRewardsFetching

  return useMemo<StakePage.Data>(() => ({
    ...state,
    refetchData: fetchData,
  }), [
    state,
    fetchData,
  ])
}


export default useBaseData
