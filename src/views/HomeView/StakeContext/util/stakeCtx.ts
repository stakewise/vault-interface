import { useMemo } from 'react'
import { useConfig } from 'config'
import { ZeroAddress } from 'ethers'
import { initContext } from 'helpers'
import { useStore, useAutoFetch, useSwapQuote, useSwapTokens } from 'hooks'

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

import { Tab } from './enum'
import useBalances from './useBalances'
import useVaultAddress from './useVaultAddress'


export const initialContext: StakePage.Context = {
  tabs: tabsMock,
  data: baseDataMock,
  vaultAddress: ZeroAddress,

  burn: useBurn.mock,
  mint: useMint.mock,
  boost: useBoost.mock,
  stake: {
    ...useStake.mock,
    isSwapQuoteFetching: false,
    getBuyAmount: () => 0n,
  },
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
  const { address } = useConfig()
  const swapTokens = useSwapTokens()
  const vaultAddress = useVaultAddress()
  const fetchBalances = useBalances(vaultAddress)
  const { isVaultFetching } = useStore(storeSelector)
  const { refetchData, ...data } = useBaseData(vaultAddress)
  const { fetchExitQueue, claimExitQueue } = useExitQueue(vaultAddress)
  const { fetchUnboostQueue, claimUnboostQueue } = useUnboostQueue({ vaultAddress, fetchBalances })

  const swapToken = swapTokens.selected

  const { fee, getBuyAmount, isFetching: isSwapQuoteFetching } = useSwapQuote({
    amount: swapToken.balance,
    fromToken: swapToken.address,
  })

  const { field, percentField } = useFields({
    tabs,
    minBalance: tabs.value === Tab.Stake ? fee / 100n * 120n : 0n, // 20% more than fee
    depositTokenBalance: address ? swapToken.balance : swapToken.emptyBalance,
    getDepositAmount: tabs.value === Tab.Stake && swapToken.address ? getBuyAmount : undefined,
  })

  const fetch = useMemo(() => ({
    data: refetchData,
    unstakeQueue: fetchExitQueue,
    unboostQueue: fetchUnboostQueue,
  }), [
    refetchData,
    fetchExitQueue,
    fetchUnboostQueue,
  ])

  useAutoFetch({
    action: fetchBalances,
    interval: 15 * 60 * 1000,
    skip: !address,
  })

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
  const stake = useStake({ ...params, swapTokens })
  const unboost = useUnboost(params)
  const unstake = useUnstake(params)

  const isFetching = data.isFetching || isVaultFetching

  return useMemo(() => ({
    data,
    tabs,
    field,
    mint,
    burn,
    stake: {
      ...stake,
      getBuyAmount,
      isSwapQuoteFetching,
    },
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
    isSwapQuoteFetching,
    getBuyAmount,
    claimExitQueue,
    claimUnboostQueue,
  ])
})
