import { useState, useCallback, useEffect } from 'react'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string | null
}

const useUnboostGasPrice = (values: Input) => {
  const { vaultAddress } = values

  const { signSDK, address } = useConfig()
  const [ gasPrice, setGasPrice ] = useState(0n)

  const fetchGasPrice = useCallback(async () => {
    if (!address || !vaultAddress) {
      return 0n
    }

    try {
      const params = {
        vaultAddress,
        percent: 100,
        userAddress: address,
      }

      const gas = await signSDK.boost.unlock.estimateGas({ ...params })

      setGasPrice(gas)
    }
    catch (error) {
      console.error('Unboost Gas price:', error as Error)

      setGasPrice(0n)
    }
  }, [ signSDK, address, vaultAddress ])

  useEffect(() => {
    fetchGasPrice()
  }, [ fetchGasPrice ])

  return gasPrice
}


export default useUnboostGasPrice
