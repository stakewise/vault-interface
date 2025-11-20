import { useMemo, useEffect, useCallback } from 'react'
import { useConfig } from 'config'
import { ZeroAddress } from 'ethers'
import { initContext } from 'helpers'
import { useStore, useActions, useAutoFetch } from 'hooks'

import vaultHooks from './vault'
import useStats from './useStats'
import useTabs, { tabsMock } from './useTabs'
import useVaultAddress from './useVaultAddress'


export const initialContext: SwapView.Context = {
  stake: vaultHooks.actions.useStake.mock,
  unstake: vaultHooks.actions.useUnstake.mock,

  boost: vaultHooks.actions.useBoost.mock,
  unboost: vaultHooks.actions.useUnboost.mock,

  mint: vaultHooks.actions.useMint.mock,
  burn: vaultHooks.actions.useBurn.mock,

  unboostQueue: vaultHooks.actions.useClaimUnboostQueue.mock,
  unstakeQueue: vaultHooks.actions.useClaimUnstakeQueue.mock,

  tvl: '',
  tabs: tabsMock,
  vaultAddress: ZeroAddress,
  isFetching: false,
}

const storeSelector = (store: Store) => ({
  isVaultFetching: store.vault.base.isFetching,
  unstakeQueueData: store.vault.user.unstakeQueue.data,
  unboostQueueData: store.vault.user.unboostQueue.data,
  isUserBalancesFetching: store.vault.user.balances.isFetching,
})

export const {
  Provider,
  useData,
  useInit,
} = initContext<SwapView.Context>(initialContext, () => {
  const actions = useActions()
  const { address, wallet } = useConfig()

  const {
    isVaultFetching,
    unstakeQueueData,
    unboostQueueData,
    isUserBalancesFetching,
  } = useStore(storeSelector)

  const vaultAddress = useVaultAddress()

  const resetFields = useCallback(() => {
    stake.field.reset()
    boost.field.reset()
    unstake.field.reset()
    unboost.percentField.reset()
  }, [])

  const tabs = useTabs(resetFields)
  const { tvl, isStatsFetching } = useStats()

  const isSkipAutofetchUnstakeQueue = Boolean(!address || !unstakeQueueData.total || unstakeQueueData.duration)
  const isSkipAutofetchUnboostQueue = Boolean(!address || !unboostQueueData.position || unboostQueueData.duration)

  const { fetchAllVaultData, resetAllVaultData } = vaultHooks.useVault({
    vaultAddress,
  })

  const {
    fetchAllUserData,
    resetAllUserData,
    fetchUnboostQueue,
    fetchUnstakeQueue,
  } = vaultHooks.useUser({
    withUserChartStats: false,
  })

  useEffect(() => {
    const onChangeChain = () => {
      resetFields()
      actions.vault.base.resetData()
    }

    const onChangeAddress = () => {
      resetFields()
      actions.vault.user.balances.resetData()
      actions.vault.user.unstakeQueue.resetData()
      actions.vault.user.unboostQueue.resetData()
    }

    wallet.subscribeBeforeChange('chain', onChangeChain)
    wallet.subscribeBeforeChange('address', onChangeAddress)

    return () => {
      wallet.unsubscribeBeforeChange('chain', onChangeChain)
      wallet.unsubscribeBeforeChange('address', onChangeAddress)
    }
  }, [])

  useEffect(() => {
    fetchAllVaultData()
  }, [ fetchAllVaultData ])

  useEffect(() => {
    fetchAllUserData()
  }, [ fetchAllUserData ])

  useEffect(() => {
    return () => {
      resetAllUserData()
      resetAllVaultData()
    }
  }, [])

  useAutoFetch({
    action: fetchUnstakeQueue,
    skip: isSkipAutofetchUnstakeQueue,
    interval: 60_000,
  })

  useAutoFetch({
    action: fetchUnboostQueue,
    skip: isSkipAutofetchUnboostQueue,
    interval: 60_000,
  })

  const stake = vaultHooks.actions.useStake({ fetchAllUserData })
  const unstake =  vaultHooks.actions.useUnstake({ fetchAllUserData })

  const boost = vaultHooks.actions.useBoost({ fetchAllUserData })
  const unboost = vaultHooks.actions.useUnboost({ fetchAllUserData })

  const mint = vaultHooks.actions.useMint({ fetchAllUserData })
  const burn = vaultHooks.actions.useBurn({ fetchAllUserData })

  const unboostQueue = vaultHooks.actions.useClaimUnboostQueue({ fetchAllUserData })
  const unstakeQueue = vaultHooks.actions.useClaimUnstakeQueue({ fetchAllUserData })

  const isFetching = (
    isStatsFetching
    || isVaultFetching
    || isUserBalancesFetching
  )

  return useMemo(() => ({
    tvl,
    tabs,
    mint,
    burn,
    stake,
    boost,
    unboost,
    unstake,
    unboostQueue,
    unstakeQueue,
    vaultAddress,
    isFetching,
    fetchAllUserData,
  }), [
    tvl,
    mint,
    burn,
    tabs,
    stake,
    boost,
    unboost,
    unstake,
    isFetching,
    unboostQueue,
    unstakeQueue,
    vaultAddress,
    fetchAllUserData,
  ])
})
