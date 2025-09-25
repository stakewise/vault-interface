import { useCallback, useState } from 'react'
import { useStore, useAutoFetch } from 'hooks'
import { constants } from 'helpers'
import { useConfig } from 'config'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  stakedAssets: store.vault.user.balances.stakedAssets,
})

const useBurnTransactionPrice = () => {
  const { signSDK, address, isReadOnlyMode } = useConfig()
  const { vaultAddress, stakedAssets } = useStore(storeSelector)

  const [ transactionPrice, setTransactionPrice ] = useState(0n)

  const isSkipFetch = !address || !vaultAddress || !stakedAssets || isReadOnlyMode

  const fetchTransactionPrice = useCallback(async () => {
    if (isSkipFetch) {
      return
    }

    try {
      const gas = await signSDK.osToken.burn.estimateGas({
        shares: constants.blockchain.minimalAmount,
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


export default useBurnTransactionPrice
