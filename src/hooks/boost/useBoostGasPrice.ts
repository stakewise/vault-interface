import { useState, useCallback, useEffect } from 'react'
import { BigDecimal, getters } from 'helpers'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string | null
  mintTokenBalance: bigint
}

const useBoostGasPrice = (values: Input) => {
  const { vaultAddress, mintTokenBalance } = values

  const { signSDK, address } = useConfig()
  const [ gasPrice, setGasPrice ] = useState(0n)

  const fetchGasPrice = useCallback(async () => {
    if (!address || !mintTokenBalance || !vaultAddress) {
      return 0n
    }

    try {
      const referrerAddress = getters.getReferrer()
      const safeAmount = new BigDecimal(mintTokenBalance).divide(2).decimals(0).toString()

      const gas = await signSDK.boost.lock.estimateGas({
        vaultAddress,
        referrerAddress,
        userAddress: address,
        amount: BigInt(safeAmount),
      })

      setGasPrice(gas)
    }
    catch (error) {
      console.error('Boost Gas price:', error as Error)

      setGasPrice(0n)
    }
  }, [ signSDK, address, mintTokenBalance, vaultAddress ])

  useEffect(() => {
    fetchGasPrice()
  }, [ fetchGasPrice ])

  return gasPrice
}


export default useBoostGasPrice
