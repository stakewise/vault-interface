import { useCallback, useEffect, useRef } from 'react'
import notifications from 'modules/notifications'
import { useActions, useMountedRef, useStore } from 'hooks'
import { useConfig } from 'config'

import useStake from './useStake'
import useBoost from './useBoost'
import useUserApy from './useUserApy'
import useWithdraw from './useWithdraw'
import useMintToken from './useMintToken'

import messages from './messages'


const storeSelector = (store: Store) => ({
  ltvPercent: BigInt(store.vault.base.data.osTokenConfig.ltvPercent),
  liqThresholdPercent: BigInt(store.vault.base.data.osTokenConfig.liqThresholdPercent),
})

const useBalances = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { address, autoConnectChecked } = useConfig()

  const fetchStake = useStake()
  const fetchBoost = useBoost()
  const fetchUserApy = useUserApy()
  const fetchWithdraw = useWithdraw()
  const fetchMintToken = useMintToken()

  const { ltvPercent, liqThresholdPercent } = useStore(storeSelector)

  const storeDataRef = useRef({ ltvPercent, liqThresholdPercent })
  storeDataRef.current = { ltvPercent, liqThresholdPercent }

  const fetchBalances = useCallback(async () => {
    const { ltvPercent, liqThresholdPercent } = storeDataRef.current

    if (!address && autoConnectChecked) {
      actions.vault.user.balances.setFetching(false)

      return
    }

    if (address && vaultAddress) {
      try {
        actions.vault.user.balances.setFetching(true)

        const stake = await fetchStake({
          userAddress: address,
          vaultAddress,
        })

        const mintToken = await fetchMintToken({
          stakedAssets: stake.assets,
          userAddress: address as string,
          liqThresholdPercent,
          vaultAddress,
          ltvPercent,
        })

        const withdraw = await fetchWithdraw({
          mintedAssets: mintToken.minted.assets,
          stakedAssets: stake.assets,
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

        const result: Omit<Store['vault']['user']['balances'], 'isFetching'> = {
          stake,
          boost,
          userAPY,
          withdraw,
          mintToken,
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
    autoConnectChecked,
    fetchStake,
    fetchBoost,
    fetchUserApy,
    fetchWithdraw,
    fetchMintToken,
  ])

  useEffect(() => {
    if (!address && autoConnectChecked) {
      actions.vault.user.balances.resetData()
    }
  }, [ actions, address, autoConnectChecked ])

  useEffect(() => {
    return () => {
      actions.vault.user.balances.resetData()
    }
  }, [])

  return fetchBalances
}


export default useBalances
