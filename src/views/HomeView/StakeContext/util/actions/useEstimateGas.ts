import { useCallback } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { constants, getters } from 'helpers'


export enum Type {
  Mint,
  Burn,
  Deposit,
  Withdraw,
}

interface Hook {
  (type: Type): (value: bigint) => Promise<bigint>
  mock: (value: bigint) => Promise<bigint>
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useEstimateGas: Hook = (type) => {
  const { signSDK, address } = useConfig()
  const { vaultAddress } = useStore(storeSelector)

  return useCallback(async (value) => {
    if (!vaultAddress) {
      return 0n
    }

    try {
      const referrerAddress = getters.getReferrer()

      const params = {
        userAddress: address || vaultAddress,
        vaultAddress,
      }

      switch (type) {
        case Type.Deposit:
          return signSDK.vault.deposit.estimateGas({ ...params, referrerAddress, assets: value })

        case Type.Withdraw:
          return signSDK.vault.withdraw.estimateGas({ ...params, assets: value })

        case Type.Mint:
          return signSDK.osToken.mint.estimateGas({ ...params, referrerAddress, shares: value })

        case Type.Burn:
          return signSDK.osToken.burn.estimateGas({ ...params, shares: value })

        default:
          console.error('Incorect estimateGas type', type)
          return Promise.resolve(0n)
      }
    }
    catch (error) {
      console.error('estimateGas error', error as Error, { value, address, vaultAddress })

      return 0n
    }
  }, [ signSDK, type, address, vaultAddress ])
}

useEstimateGas.mock = () => Promise.resolve(constants.blockchain.amount0)


export default useEstimateGas
