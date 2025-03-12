import { useState, useRef, useCallback } from 'react'
import { useAutoFetch, useStore } from 'hooks'
import { formatEther } from 'ethers'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  maxWithdrawAssets: store.vault.user.balances.withdraw.maxAssets,
})

const useTransactionPrice = () => {
  const { unstake } = stakeCtx.useData()
  const { maxWithdrawAssets } = useStore(storeSelector)
  const [ transactionPrice, setTransactionPrice ] = useState('')

  const maxWithdrawAssetsRef = useRef(maxWithdrawAssets)
  maxWithdrawAssetsRef.current = maxWithdrawAssets

  const fetchTransactionPrice = useCallback(async () => {
    if (maxWithdrawAssetsRef.current) {
      const gas = await unstake.getWithdrawGas(maxWithdrawAssetsRef.current)
      const transactionPrice = formatEther(gas)

      setTransactionPrice(transactionPrice)
    }
  }, [ unstake ])

  useAutoFetch({
    action: fetchTransactionPrice,
    skip: !maxWithdrawAssets,
    interval: 15_000,
  })

  return transactionPrice
}


export default useTransactionPrice
