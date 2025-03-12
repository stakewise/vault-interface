import { useState, useCallback, useRef, useMemo } from 'react'
import { useStore, useAutoFetch } from 'hooks'
import { formatEther } from 'ethers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
})

const useTransactionPrice = () => {
  const { burn } = stakeCtx.useData()
  const { mintTokenBalance, mintedShares } = useStore(storeSelector)

  const [ transactionPrice, setTransactionPrice ] = useState('')

  const params = useMemo(() => ({
    mintTokenBalance,
    mintedShares,
  }), [ mintedShares, mintTokenBalance ])

  const paramsRef = useRef(params)
  paramsRef.current = params

  const fetchTransactionPrice = useCallback(async () => {
    const { mintedShares, mintTokenBalance } = paramsRef.current

    if (mintedShares > 0) {
      const maxBurn = mintedShares > mintTokenBalance ? mintTokenBalance : mintedShares

      const gas = await burn.getBurnGas(maxBurn)

      const transactionPrice = formatEther(gas)

      setTransactionPrice(transactionPrice)
    }
  }, [ burn ])

  useAutoFetch({
    action: fetchTransactionPrice,
    interval: 15_000,
  })

  return transactionPrice
}


export default useTransactionPrice
