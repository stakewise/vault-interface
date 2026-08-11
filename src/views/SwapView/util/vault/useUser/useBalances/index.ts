import { useCallback, useMemo } from 'react'
import { useStore, useActions, useMountedRef } from 'hooks'
import notifications from 'modules/notifications'
import { useConfig } from 'config'

import useStake from './useStake'
import useBoost from './useBoost'
import useUserApy from './useUserApy'
import useMintToken from './useMintToken'
import useMaxWithdrawAssets from './useMaxWithdrawAssets'

import messages from './messages'


const storeSelector = (store: Store) => ({
  isVaultFetching: store.vault.base.isFetching,
})

const useBalances = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { address, autoConnectChecked } = useConfig()

  const fetchStake = useStake()
  const fetchBoost = useBoost()
  const fetchUserApy = useUserApy()
  const fetchMintToken = useMintToken()
  const fetchWithdraw = useMaxWithdrawAssets()

  const { isVaultFetching } = useStore(storeSelector)

  const fetchBalances = useCallback(async () => {
    if ((!address && autoConnectChecked) || isVaultFetching) {
      actions.vault.user.balances.setFetching(false)

      return
    }

    if (address && vaultAddress) {

      try {
        actions.vault.user.balances.setFetching(true)

        const params = {
          userAddress: address,
          vaultAddress,
        }

        const [ stake, boost, userAPY, maxWithdrawAssets, mintToken ] = await Promise.all([
          fetchStake(params),
          fetchBoost(params),
          fetchUserApy(params),
          fetchWithdraw(params),
          fetchMintToken(params),
        ])

        const {
          stakedAssets,
          totalEarnedAssets,
          totalBoostEarnedAssets,
          totalStakeEarnedAssets,
        } = stake

        const result: Omit<Store['vault']['user']['balances'], 'isFetching'> = {
          boost,
          userAPY,
          mintToken,
          stakedAssets,
          totalEarnedAssets,
          maxWithdrawAssets,
          totalBoostEarnedAssets,
          totalStakeEarnedAssets,
        }

        if (mountedRef.current) {
          actions.vault.user.balances.setData(result)
        }
      }
      catch (error) {
        console.error(error)
        actions.vault.user.balances.setFetching(false)

        notifications.open({
          type: 'error',
          text: messages.error,
        })
      }
    }
  }, [
    address,
    actions,
    mountedRef,
    vaultAddress,
    isVaultFetching,
    autoConnectChecked,
    fetchStake,
    fetchBoost,
    fetchUserApy,
    fetchWithdraw,
    fetchMintToken,
  ])

  const resetBalances = useCallback(() => {
    actions.vault.user.balances.resetData()
  }, [ actions ])

  return useMemo(() => ({
    fetchBalances,
    resetBalances,
  }), [
    fetchBalances,
    resetBalances,
  ])
}


export default useBalances
