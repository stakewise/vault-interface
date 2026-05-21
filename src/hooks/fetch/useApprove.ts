import { useCallback, useMemo, useState } from 'react'
import { formatEther, MaxInt256 } from 'ethers'
import { requests } from 'helpers'
import { useConfig } from 'config'

import useAllowance, { CheckAllowanceInput } from './useAllowance'
import useBalances from '../data/useBalances'


type Input = {
  recipient: string
  tokenAddress: string
  skip?: boolean
}

type Output = {
  allowance: bigint
  isFetching: boolean
  isSubmitting: boolean
  getGas: (amount?: bigint) => Promise<bigint>
  approve: (amount?: bigint) => Promise<string>
  checkAllowance: (values: CheckAllowanceInput) => Promise<void>
}

interface Hook {
  (values: Input): Output
  mock: Output
}

const useApprove: Hook = (values) => {
  const { recipient, tokenAddress, skip } = values

  const { library, address } = useConfig()
  const { refetchNativeTokenBalance } = useBalances()

  const { allowance, isFetching, checkAllowance } = useAllowance({
    tokenAddress,
    recipient,
    skip,
  })

  const [ isSubmitting, setSubmitting ] = useState(false)

  const getGas = useCallback(async (amount?: bigint): Promise<bigint> => {
    if (!address || !library) {
      return 0n
    }

    try {
      const gas = await requests.getApproveGas({
        provider: library,
        from: address,
        to: recipient,
        tokenAddress,
        amount: amount?.toString(),
      })

      return gas
    }
    catch (error) {
      console.error('getApproveGas error', error)

      return 0n
    }
  }, [
    address,
    library,
    recipient,
    tokenAddress,
  ])

  const approve = useCallback(async (amount?: bigint) => {
    if (!address) {
      return Promise.reject('Address is not defined')
    }
    if (!library) {
      return Promise.reject('Library is not defined')
    }

    setSubmitting(true)

    try {
      const approveAmount = amount || MaxInt256

      const { hash } = await requests.approve({
        provider: library,
        from: address,
        to: recipient,
        tokenAddress,
        amount,
      })

      refetchNativeTokenBalance()
      setSubmitting(false)

      if (hash) {
        console.log('approve', {
          amount: approveAmount === MaxInt256 ? 'MAX' : formatEther(approveAmount),
          tokenAddress,
          recipient,
        })

        return hash
      }
      else {
        return Promise.reject('TxHash is not defined')
      }
    }
    catch (error) {
      setSubmitting(false)

      return Promise.reject(error)
    }
  }, [
    address,
    library,
    recipient,
    tokenAddress,
    refetchNativeTokenBalance,
  ])

  return useMemo(() => ({
    allowance,
    isFetching,
    isSubmitting,
    getGas,
    approve,
    checkAllowance,
  }), [
    allowance,
    isFetching,
    isSubmitting,
    getGas,
    approve,
    checkAllowance,
  ])
}

useApprove.mock = {
  allowance: 0n,
  isFetching: false,
  isSubmitting: false,
  getGas: async () => 0n,
  approve: async () => '',
  checkAllowance: async () => undefined,
}


export default useApprove
