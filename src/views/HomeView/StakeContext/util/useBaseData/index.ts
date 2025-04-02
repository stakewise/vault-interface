import { useEffect, useCallback, useMemo } from 'react'
import { useObjectState, useStore } from 'hooks'
import notifications from 'modules/notifications'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import methods from 'helpers/methods'

import useAPY from './useAPY'
import useUserRewards from './useUserRewards'


const storeSelector = (store: Store) => ({
  userAPY: store.vault.user.balances.userAPY,
  totalAssets: store.vault.base.data.totalAssets,
  isBalancesFetching: store.vault.user.balances.isFetching,
})

const initialState: StakePage.BaseData = {
  ltvPercent: 0n,
  fee: methods.formatApy(0),
  userRewards: 0n,
  isFetching: true,
  apy: {
    vault: 0,
    maxBoost: 0,
    mintToken: 0,
  },
}

export const baseDataMock: StakePage.Data = {
  ...initialState,
  apy: {
    ...initialState.apy,
    user: 0,
  },
  tvl: methods.formatApy(0),
  refetchData: () => Promise.resolve(),
}

const useBaseData = (vaultAddress: string) => {
  const { sdk } = useConfig()
  const [ state, setState ] = useObjectState(initialState)
  const { totalAssets, userAPY, isBalancesFetching } = useStore(storeSelector)

  const fetchAPY = useAPY(vaultAddress)
  const fetchUserRewards = useUserRewards(vaultAddress)

  const tvl = useMemo(() => {
    return `${methods.formatTokenValue(totalAssets)} ${sdk.config.tokens.depositToken}`
  }, [ sdk, totalAssets ])

  const fetchData = useCallback(async () => {
    try {
      const [ apyData, userRewards ] = await Promise.all([
        fetchAPY(),
        fetchUserRewards(),
      ])

      const { apy, fee, ltvPercent } = apyData

      setState({
        apy,
        fee,
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
  }, [ fetchAPY, fetchUserRewards, setState ])

  useEffect(() => {
    fetchData()
  }, [ fetchData ])

  return useMemo<StakePage.Data>(() => ({
    ...state,
    apy: {
      ...state.apy,
      user: userAPY,
    },
    tvl,
    isFetching: state.isFetching || isBalancesFetching,
    refetchData: fetchData,
  }), [
    tvl,
    userAPY,
    state,
    isBalancesFetching,
    fetchData,
  ])
}


export default useBaseData
