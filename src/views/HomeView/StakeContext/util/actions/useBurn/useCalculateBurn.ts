import { useCallback } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'


const storeSelector = (store: Store) => ({
  ltvPercent: BigInt(store.vault.base.data.osTokenConfig.ltvPercent),
  vaultAddress: store.vault.base.data.vaultAddress,
  stakedAssets: store.vault.user.balances.stake.assets,
  isMintTokenDataFetching: store.vault.base.isFetching,
  isBalancesFetching: store.vault.user.balances.isFetching,
  mintedAssets: store.vault.user.balances.mintToken.minted.assets,
})

const useCalculateBurn = () => {
  const { sdk } = useConfig()

  const {
    ltvPercent,
    stakedAssets,
    mintedAssets,
    vaultAddress,
    isBalancesFetching,
    isMintTokenDataFetching,
  } = useStore(storeSelector)

  const isFetching = isBalancesFetching || isMintTokenDataFetching

  return useCallback(async (newStakedAssets: bigint) => {
    try {
      if (mintedAssets && !isFetching) {
        const sharesToBurn = await sdk.osToken.getBurnAmount({
          newStakedAssets,
          mintedAssets,
          stakedAssets,
          vaultAddress,
          ltvPercent,
        })

        return sharesToBurn
      }
    }
    catch (error) {
      console.error('calculateBurn error', error as Error, {
        mintedAssets,
        stakedAssets,
      })

      return Promise.reject(error)
    }

    return 0n
  }, [ sdk, stakedAssets, mintedAssets, ltvPercent, vaultAddress, isFetching ])
}


export default useCalculateBurn
