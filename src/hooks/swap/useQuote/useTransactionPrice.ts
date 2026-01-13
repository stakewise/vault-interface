import { useCallback } from 'react'
import { useConfig } from 'config'
import { createContracts } from 'helpers/contracts'

import useSigner from '../useSigner'


type Input = {
  amount: string
  address: string
  isWithdraw: boolean
}

const useTransactionPrice = () => {
  const { signSDK } = useConfig()

  const getSigner = useSigner()

  return useCallback(async ({ amount, address, isWithdraw }: Input) => {
    const signer = await getSigner()
    const contract = createContracts(signSDK).helpers.createWrappedToken(address).connect(signer)

    try {
      const estimatedGas = isWithdraw
        ? await contract.withdraw.estimateGas(amount)
        : await contract.deposit.estimateGas({ value: amount })

      return estimatedGas
    }
    catch (error) {
      console.error('Fetch wrap transaction price error', error)

      return 0n
    }
  }, [ signSDK, getSigner ])
}


export default useTransactionPrice