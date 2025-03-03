import { useState, useCallback } from 'react'
import { useAutoFetch, useStore } from 'hooks'
import { formatEther } from 'ethers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  maxMintShares: store.vault.user.balances.mintToken.maxMintShares,
})

const useTransactionPrice = () => {
  const { mint } = stakeCtx.useData()
  const { maxMintShares } = useStore(storeSelector)

  const [ transactionPrice, setTransactionPrice ] = useState('')

  const fetchTransactionPrice = useCallback(async () => {
    const amount = Number(maxMintShares)

    if (amount) {
      const gas = await mint.getMintGas(maxMintShares)

      const transactionPrice = formatEther(gas)

      setTransactionPrice(transactionPrice)
    }
  }, [ mint, maxMintShares ])

  useAutoFetch({
    action: fetchTransactionPrice,
    interval: 15_000,
  })

  return transactionPrice
}


export default useTransactionPrice
