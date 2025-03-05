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

import {
  useExitQueue,
  useUnboostQueue,
} from './user'

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
  unstakeQueue: { claim: Promise.resolve },
  unboostQueue: { claim: Promise.resolve },

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
} = initContext<StakePage.Context>(initialContext, () => {
  const tabs = useTabs()
  const vaultAddress = useVaultAddress()
  const fetchBalances = useBalances(vaultAddress)
  const { isVaultFetching } = useStore(storeSelector)
  const { field, percentField } = useFields({ tabs })
  const { refetchData, ...data } = useBaseData(vaultAddress)
  const { fetchExitQueue, claimExitQueue } = useExitQueue(vaultAddress)
  const { fetchUnboostQueue, claimUnboostQueue } = useUnboostQueue({ vaultAddress, fetchBalances })

  const fetch = useMemo(() => ({
    data: refetchData,
    unstakeQueue: fetchExitQueue,
    unboostQueue: fetchUnboostQueue,
  }), [
    refetchData,
    fetchExitQueue,
    fetchUnboostQueue,
  ])

  useEffect(() => {
    fetchBalances()
  }, [ fetchBalances ])

  const params = useMemo(() => ({
    vaultAddress,
    percentField,
    field,
    fetch,
  }), [
    fetch,
    field,
    percentField,
    vaultAddress,
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
    unstakeQueue: {
      claim: claimExitQueue,
    },
    unboostQueue: {
      claim: claimUnboostQueue,
    },
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
    claimExitQueue,
    claimUnboostQueue,
  ])
})
