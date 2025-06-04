import { useCallback, useMemo } from 'react'
import { StakeStep } from 'helpers/enums'
import type { SetTransaction } from '../../components/Transactions/types'
import Transactions from '../../components/Transactions/Transactions'

import useApprove from '../fetch/useApprove'

import useApproveRequired from './useApproveRequired'


type SubmitInput = {
  setTransaction: SetTransaction
}

type Input = {
  step: StakeStep
  field: Forms.Field<bigint>
  tokenAddress: string
  recipient: string
  skip?: boolean
}

const useStakeApprove = ({ step, field, tokenAddress, recipient, skip }: Input) => {
  const { allowance, isFetching, getGas, approve, checkAllowance } = useApprove({
    tokenAddress,
    recipient,
    skip,
  })

  const isApproveRequired = useApproveRequired({
    amountField: field,
    allowance,
    skip,
  })

  const handleApprove = useCallback(async (values: SubmitInput) => {
    const { setTransaction } = values

    try {
      setTransaction(step, Transactions.Status.Confirm)

      const hash = await approve()

      setTransaction(step, Transactions.Status.Waiting)

      await checkAllowance({ hash, allowance })

      setTransaction(step, Transactions.Status.Success)
    }
    catch (error) {
      const failedSteps = step === StakeStep.SwapApprove
        ? [ StakeStep.SwapApprove, StakeStep.Swap, StakeStep.Approve, StakeStep.Stake ]
        : [ StakeStep.Approve, StakeStep.Stake ]

      failedSteps.forEach((step) => {
        setTransaction(step, Transactions.Status.Fail)
      })

      return Promise.reject(error)
    }
  }, [ step, allowance, approve, checkAllowance ])

  return useMemo(() => ({
    isFetching,
    isRequired: isApproveRequired,
    approve: handleApprove,
    getGas,
  }), [
    isApproveRequired,
    isFetching,
    getGas,
    handleApprove,
  ])
}


export default useStakeApprove
