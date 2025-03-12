import { useState, useCallback } from 'react'
import { formatEther, parseEther } from 'ethers'
import { useStore, useAutoFetch } from 'hooks'
import { constants } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  capacity: store.vault.base.data.capacity,
  totalAssets: store.vault.base.data.totalAssets,
  vaultAddress: store.vault.base.data.vaultAddress,
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

const useTransactionPrice = () => {
  const { stake } = stakeCtx.useData()
  const { depositTokenBalance, totalAssets, capacity } = useStore(storeSelector)

  const [ transactionPrice, setTransactionPrice ] = useState('')

  const fetchTransactionPrice = useCallback(async () => {
    if (Number(depositTokenBalance)) {
      // We need to calculate such an amount to calculate the transaction gas,
      // but in order for the calculation not to fail, the amount must be on
      // the user's balance and not exceed the vault capacity
      let amount = depositTokenBalance > constants.blockchain.amount1
        ? constants.blockchain.amount1
        : depositTokenBalance

      if (!isNaN(Number(capacity))) {
        const max = parseEther(capacity) + parseEther(totalAssets)

        if (amount > max) {
          amount = max
        }
      }

      const gas = await stake.getDepositGas(amount)

      const transactionPrice = formatEther(gas)

      setTransactionPrice(transactionPrice)
    }
  }, [ stake, capacity, totalAssets, depositTokenBalance ])

  useAutoFetch({
    action: fetchTransactionPrice,
    interval: 15_000,
  })

  return transactionPrice
}


export default useTransactionPrice
