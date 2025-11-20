import { useCallback, useState, useEffect } from 'react'
import { parseEther } from 'ethers'
import { useConfig } from 'config'
import { useStore } from 'hooks'


const storeSelector = (store: Store) => ({
  isVaultFetching: store.vault.base.isFetching,
  vaultAddress: store.vault.base.data.vaultAddress,
  isBalancesFetching: store.vault.user.balances.isFetching,
  hasMintBalance: store.vault.user.balances.mintToken.hasMintBalance,
})

const minBurnAmount = parseEther('0.00001')

const useFullUnstakeBurnAmount = () => {
  const { sdk, address } = useConfig()

  const {
    vaultAddress,
    hasMintBalance,
    isVaultFetching,
    isBalancesFetching,
  } = useStore(storeSelector)

  const [ fullUnstakeBurnAmount, setFullUnstakeBurnAmount ] = useState<bigint | null>(null)

  const isFetching = isBalancesFetching || isVaultFetching

  const calculateBurn = useCallback(async () => {
    try {
      if (hasMintBalance && !isFetching && address) {
        const sharesToBurn = await sdk.osToken.getBurnAmountForUnstake({
          userAddress: address,
          vaultAddress,
        })

        if (sharesToBurn > minBurnAmount) {
          setFullUnstakeBurnAmount(sharesToBurn)
        }
        else {
          setFullUnstakeBurnAmount(null)
        }
      }
    }
    catch (error) {
      console.error('calculateBurn error', error as Error)

      return Promise.reject(error)
    }
  }, [
    sdk,
    address,
    isFetching,
    vaultAddress,
    hasMintBalance,
  ])

  useEffect(() => {
    calculateBurn()
  }, [ calculateBurn ])

  return fullUnstakeBurnAmount
}


export default useFullUnstakeBurnAmount
