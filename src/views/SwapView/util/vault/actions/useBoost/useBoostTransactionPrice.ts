import { useState, useCallback } from 'react'
import { useStore, useAutoFetch } from 'hooks'
import { BigDecimal, getters } from 'helpers'
import { useConfig } from 'config'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

const useBoostTransactionPrice = () => {
  const { signSDK, address, isReadOnlyMode } = useConfig()
  const { vaultAddress, mintedShares } = useStore(storeSelector)

  const [ transactionPrice, setTransactionPrice ] = useState(0n)

  const isSkipFetch = !address || !mintedShares || !vaultAddress || isReadOnlyMode

  const fetchTransactionPrice = useCallback(async () => {
    if (isSkipFetch) {
      return
    }

    try {
      const referrerAddress = getters.getReferrer()

      const safeAmount = new BigDecimal(mintedShares)
        .divide(2)
        .decimals(0)
        .toString()

      const gas = await signSDK.boost.lock.estimateGas({
        vaultAddress,
        referrerAddress,
        userAddress: address,
        amount: BigInt(safeAmount),
      })

      setTransactionPrice(gas)
    }
    catch {
      setTransactionPrice(0n)
    }
  }, [ signSDK, address, mintedShares, vaultAddress, isSkipFetch ])

  useAutoFetch({
    action: fetchTransactionPrice,
    skip: isSkipFetch,
    interval: 30_000,
  })

  return transactionPrice
}


export default useBoostTransactionPrice
