import { useCallback } from 'react'
import { useConfig } from 'config'
import { getters } from 'helpers'


const useBalance = (vaultAddress: string) => {
  const { sdk, signSDK, address, activeWallet } = useConfig()

  return useCallback(async (mintTokenBalance: bigint) => {
    if (!address) {
      return 0n
    }

    try {
      const [
        signer,
        { params },
        { rewardAssets, shares },
      ] = await Promise.all([
        getters.getSigner({ sdk, signSDK, address, activeWallet }),
        sdk.vault.getHarvestParams({ vaultAddress }),
        sdk.boost.getData({ vaultAddress, userAddress: address }),
      ])

      const signedContract = signSDK.contracts.special.stakeCalculator.connect(signer)

      const mintedAssets = await signedContract.getBalance.staticCall({
        osTokenShares: mintTokenBalance + shares,
        harvestParams: params,
        vault: vaultAddress,
        user: address,
      })

      return mintedAssets + rewardAssets
    }
    catch (error) {
      console.error('Stake: fetchStake error', error as Error)
      return Promise.reject('Stake: fetchStake error')
    }
  }, [ address, sdk, signSDK, activeWallet, vaultAddress ])
}


export default useBalance
