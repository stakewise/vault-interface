import { useCallback, useRef, useMemo } from 'react'
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
  ltvPercent: BigInt(store.vault.base.data.osTokenConfig.ltvPercent),
  liqThresholdPercent: BigInt(store.vault.base.data.osTokenConfig.liqThresholdPercent),
})

const useBalances = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { sdk, address, autoConnectChecked } = useConfig()

  const fetchStake = useStake()
  const fetchBoost = useBoost()
  const fetchUserApy = useUserApy()
  const fetchMintToken = useMintToken()
  const fetchWithdraw = useMaxWithdrawAssets()

  const { ltvPercent, isVaultFetching, liqThresholdPercent } = useStore(storeSelector)

  const storeDataRef = useRef({ ltvPercent, liqThresholdPercent })
  storeDataRef.current = { ltvPercent, liqThresholdPercent }

  const fetchBalances = useCallback(async () => {
    const { ltvPercent, liqThresholdPercent } = storeDataRef.current

    if ((!address && autoConnectChecked) || isVaultFetching) {
      actions.vault.user.balances.setFetching(false)

      return
    }

    if (address && vaultAddress) {
      try {
        actions.vault.user.balances.setFetching(true)

        const {
          stakedAssets,
          totalEarnedAssets,
          totalExtraEarnedAssets,
          totalBoostEarnedAssets,
          totalStakeEarnedAssets,
        } = await fetchStake({
          userAddress: address,
          vaultAddress,
        })

        const mintToken = await fetchMintToken({
          stakedAssets: stakedAssets,
          userAddress: address as string,
          liqThresholdPercent,
          vaultAddress,
          ltvPercent,
        })

        const maxWithdrawAssets = await fetchWithdraw({
          mintedAssets: mintToken.mintedAssets,
          stakedAssets: stakedAssets,
          vaultAddress,
          ltvPercent,
        })

        const [ boost, userAPY ] = await Promise.all([
          fetchBoost({
            userAddress: address,
            vaultAddress,
          }),
          fetchUserApy({
            userAddress: address,
            vaultAddress,
          }),
        ])

        const boostedAssets = await sdk.contracts.base.mintTokenController.convertToShares(boost.shares)
        const mintedAssets = mintToken.mintedAssets

        const mintTokenAssets = boostedAssets > mintedAssets ? boostedAssets : mintedAssets
        const totalRewardingAssets = stakedAssets + boost.rewardAssets + mintTokenAssets - mintedAssets

        const result: Omit<Store['vault']['user']['balances'], 'isFetching'> = {
          boost,
          userAPY,
          mintToken,
          stakedAssets,
          totalEarnedAssets,
          maxWithdrawAssets,
          totalRewardingAssets,
          totalExtraEarnedAssets,
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
    sdk,
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
