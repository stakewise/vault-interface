import { useMemo } from 'react'
import { ZeroAddress } from 'ethers'
import { initContext } from 'helpers'

import boostHooks from './boost'
import stakeHooks from './stake'
import useFields from './useFields'
import useTabs, { tabsMock } from './useTabs'
import useBaseData, { baseDataMock } from './useBaseData'


export const initialContext: StakePage.Context = {
  tabs: tabsMock,
  data: baseDataMock,
  vaultAddress: ZeroAddress,
  boost: boostHooks.mockLock,
  stake: stakeHooks.mockStake,
  unboost: boostHooks.mockUnlock,
  unstake: stakeHooks.mockUnstake,
  unstakeQueue: stakeHooks.mockQueue,
  unboostQueue: boostHooks.mockQueue,
  field: {} as Forms.Field<bigint>,
  percentField: {} as Forms.Field<string>,
  isFetching: false,
}

export const {
  Provider,
  useData,
  useInit,
} = initContext<StakePage.Context, StakePage.Input>(initialContext, ({ vaultAddress }) => {
  const tabs = useTabs()
  const data = useBaseData(vaultAddress)
  const { field, percentField } = useFields({ tabs, data })

  const unstakeQueue = stakeHooks.useQueue(vaultAddress)
  const unboostQueue = boostHooks.useQueue({ vaultAddress, data })

  const params = useMemo(() => ({
    vaultAddress,
    unstakeQueue,
    unboostQueue,
    percentField,
    field,
    data,
  }), [
    vaultAddress,
    unstakeQueue,
    unboostQueue,
    percentField,
    field,
    data,
  ])

  const boost = boostHooks.useLock(params)
  const stake = stakeHooks.useStake(params)
  const unstake = stakeHooks.useUnstake(params)
  const unboost = boostHooks.useUnlock(params)

  const isFetching = (
    data.isFetching
    || boost.isFetching
    || unboostQueue.isFetching
    || unstakeQueue.isFetching
  )

  return useMemo(() => ({
    tabs,
    data,
    field,
    stake,
    boost,
    unboost,
    unstake,
    unboostQueue,
    unstakeQueue,
    percentField,
    vaultAddress,
    isFetching,
  }), [
    tabs,
    data,
    field,
    stake,
    boost,
    unboost,
    unstake,
    unboostQueue,
    unstakeQueue,
    percentField,
    vaultAddress,
    isFetching,
  ])
})
