import { useCallback, useMemo, useRef, useState } from 'react'
import { formatEther, MaxInt256 } from 'ethers'
import { requests } from 'helpers'
import { useConfig } from 'config'

import useAllowance from './useAllowance'


type Input = {
  recipient: string
  tokenAddress: string
  skip?: boolean
}

const useApprove = (values: Input) => {
  const { recipient, tokenAddress, skip } = values

  const { signSDK, address } = useConfig()

  const { allowance, isFetching, checkAllowance } = useAllowance({
    tokenAddress,
    recipient,
    skip,
  })

  const [ isSubmitting, setSubmitting ] = useState(false)

  const allowanceRef = useRef(allowance)
  allowanceRef.current = allowance

  const approve = useCallback(async (amount?: bigint) => {
    if (!address) {
      return
    }

    setSubmitting(true)

    try {
      const approveAmount = amount || MaxInt256

      const { hash } = await requests.approve({
        signSDK,
        from: address,
        to: recipient,
        tokenAddress,
        amount: amount?.toString(),
      })

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
    signSDK,
    recipient,
    tokenAddress,
  ])

  return useMemo(() => ({
    allowance,
    isFetching,
    isSubmitting,
    approve,
    checkAllowance,
  }), [
    allowance,
    isFetching,
    isSubmitting,
    approve,
    checkAllowance,
  ])
}


export default useApprove
