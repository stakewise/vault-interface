import { useCallback, useState, useEffect } from 'react'
import { parseEther } from 'ethers'
import { useConfig } from 'config'
import { useStore } from 'hooks'


const storeSelector = (store: Store) => ({
  isVaultFetching: store.vault.base.isFetching,
  vaultAddress: store.vault.base.data.vaultAddress,
  stakedAssets: store.vault.user.balances.stakedAssets,
  isBalancesFetching: store.vault.user.balances.isFetching,
  ltvPercent: store.vault.base.data.osTokenConfig.ltvPercent,
  mintedAssets: store.vault.user.balances.mintToken.mintedAssets,
})

const minBurnAmount = parseEther('0.00001')

const useFullUnstakeBurnAmount = () => {
  const { sdk, address } = useConfig()

  const {
    ltvPercent,
    stakedAssets,
    mintedAssets,
    vaultAddress,
    isVaultFetching,
    isBalancesFetching,
  } = useStore(storeSelector)

  const [ fullUnstakeBurnAmount, setFullUnstakeBurnAmount ] = useState<bigint | null>(null)

  const isFetching = isBalancesFetching || isVaultFetching

  const calculateBurn = useCallback(async () => {
    try {
      if (mintedAssets && !isFetching && address) {
        const sharesToBurn = await sdk.osToken.getBurnAmount({
          ltvPercent: BigInt(ltvPercent),
          newStakedAssets: stakedAssets,
          mintedAssets,
          stakedAssets,
          vaultAddress,
        })

        if (sharesToBurn > minBurnAmount) {
          setFullUnstakeBurnAmount(sharesToBurn) // ?
        }
        else {
          setFullUnstakeBurnAmount(null)
        }
      }
    }
    catch (error) {
      console.error('calculateBurn error', error as Error, {
        mintedAssets,
        stakedAssets,
      })

      return Promise.reject(error)
    }
  }, [
    sdk,
    address,
    ltvPercent,
    isFetching,
    stakedAssets,
    mintedAssets,
    vaultAddress,
  ])

  useEffect(() => {
    calculateBurn()
  }, [ calculateBurn ])

  return fullUnstakeBurnAmount
}


export default useFullUnstakeBurnAmount
