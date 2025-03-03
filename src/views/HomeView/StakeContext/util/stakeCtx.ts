import { useEffect, useMemo } from 'react'
import { ZeroAddress } from 'ethers'
import { initContext } from 'helpers'

import useFields from './useFields'
import useTabs, { tabsMock } from './useTabs'
import useBaseData, { baseDataMock } from './useBaseData'
import {
  useBurn,
  useMint,
  useStake,
  useBoost,
  useUnboost,
  useWithdraw,
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
  withdraw: useWithdraw.mock,

  // unstakeQueue: stakeHooks.mockQueue,
  // unboostQueue: boostHooks.mockQueue,
  field: {} as Forms.Field<bigint>,
  percentField: {} as Forms.Field<string>,
  isFetching: false,
}

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
  const withdraw = useWithdraw(params)

  const isFetching = (
    data.isFetching
  )

  return useMemo(() => ({
    tabs,
    data,
    field,
    mint,
    stake,
    boost,
    unboost,
    unstake: withdraw,
    // unstake,
    // unboostQueue,
    // unstakeQueue,
    percentField,
    vaultAddress,
    isFetching,
  }), [
    tabs,
    data,
    field,
    mint,
    stake,
    boost,
    unboost,
    withdraw,
    // unstake,
    // unboostQueue,
    // unstakeQueue,
    percentField,
    vaultAddress,
    isFetching,
  ])
})
