import { useState, useCallback } from 'react'
import { useStore, useAutoFetch } from 'hooks'
import { useConfig } from 'config'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useUnboostTransactionPrice = () => {
  const { vaultAddress } = useStore(storeSelector)

  const { signSDK, address, isReadOnlyMode } = useConfig()
  const [ transactionPrice, setTransactionPrice ] = useState(0n)

  const isSkipFetch = !address || !vaultAddress || isReadOnlyMode

  const fetchTransactionPrice = useCallback(async () => {
    if (isSkipFetch) {
      return
    }

    try {
      const params = {
        vaultAddress,
        percent: 100,
        userAddress: address,
      }

      const gas = await signSDK.boost.unlock.estimateGas({ ...params })

      setTransactionPrice(gas)
    }
    catch {
      setTransactionPrice(0n)
    }
  }, [ signSDK, address, vaultAddress, isSkipFetch ])

  useAutoFetch({
    action: fetchTransactionPrice,
    skip: isSkipFetch,
    interval: 30_000,
  })

  return transactionPrice
}


export default useUnboostTransactionPrice
