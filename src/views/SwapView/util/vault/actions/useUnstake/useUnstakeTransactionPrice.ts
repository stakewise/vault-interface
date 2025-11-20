import { useState, useCallback } from 'react'
import { useStore, useAutoFetch } from 'hooks'
import { constants } from 'helpers'
import { useConfig } from 'config'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useUnstakeTransactionPrice = () => {
  const { vaultAddress } = useStore(storeSelector)

  const { signSDK, address, isReadOnlyMode } = useConfig()
  const [ transactionPrice, setTransactionPrice ] = useState(0n)

  const isSkipFetch = !address || !vaultAddress || isReadOnlyMode

  const fetchTransactionPrice = useCallback(async () => {
    if (isSkipFetch) {
      return
    }

    try {
      const gas = await signSDK.vault.withdraw.estimateGas({
        assets: constants.blockchain.minimalAmount,
        userAddress: address,
        vaultAddress,
      })

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


export default useUnstakeTransactionPrice
