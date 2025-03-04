import { useEffect, useMemo } from 'react'
import { ZeroAddress } from 'ethers'
import { initContext } from 'helpers'
import { useStore } from 'hooks'

import useFields from './useFields'
import useTabs, { tabsMock } from './useTabs'
import useBaseData, { baseDataMock } from './useBaseData'
import {
  useBurn,
  useMint,
  useStake,
  useBoost,
  useUnboost,
  useUnstake,
} from './actions'

import useBalances from './useBalances'
import useVaultAddress from './useVaultAddress'


export const initialContext: StakePage.Context = {
  tabs: tabsMock,
  data: baseDataMock,
  vaultAddress: ZeroAddress,

  burn: useBurn.mock,
  mint: useMint.mock,
  boost: useBoost.mock,
  stake: useStake.mock,
  unboost: useUnboost.mock,
  unstake: useUnstake.mock,

  // unstakeQueue: stakeHooks.mockQueue,
  // unboostQueue: boostHooks.mockQueue,
  field: {} as Forms.Field<bigint>,
  percentField: {} as Forms.Field<string>,
  isFetching: false,
}

const storeSelector = (store: Store) => ({
  isVaultFetching: store.vault.base.isFetching,
})

export const {
  Provider,
  useData,
  useInit,
} = initContext<StakePage.Context, StakePage.Input>(initialContext, () => {
  const vaultAddress = useVaultAddress()

  const tabs = useTabs()
  const data = useBaseData(vaultAddress)
  const fetchBalances = useBalances(vaultAddress)
  const { field, percentField } = useFields({ tabs })
  const { isVaultFetching } = useStore(storeSelector)

  useEffect(() => {
    fetchBalances()
  }, [ fetchBalances ])

  // const unstakeQueue = stakeHooks.useQueue(vaultAddress)
  // const unboostQueue = boostHooks.useQueue({ vaultAddress, data })

  const params = useMemo(() => ({
    vaultAddress,
    // unstakeQueue,
    // unboostQueue,
    percentField,
    field,
    // data,
  }), [
    vaultAddress,
    // unstakeQueue,
    // unboostQueue,
    percentField,
    field,
    // data,
  ])

  const burn = useBurn(params)
  const mint = useMint(params)
  const boost = useBoost(params)
  const stake = useStake(params)
  const unboost = useUnboost(params)
  const unstake = useUnstake(params)

  const isFetching = data.isFetching || isVaultFetching

  return useMemo(() => ({
    data,
    tabs,
    field,
    mint,
    burn,
    stake,
    boost,
    unboost,
    unstake,
    percentField,
    vaultAddress,
    isFetching,
  }), [
    data,
    tabs,
    field,
    mint,
    burn,
    stake,
    boost,
    unstake,
    unboost,
    percentField,
    vaultAddress,
    isFetching,
  ])
})
