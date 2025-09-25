import { useCallback, useMemo, useState, useEffect } from 'react'
import { useFieldListener, useApprove } from 'hooks'
import { StakeStep } from 'helpers/enums'

import { Transactions } from 'components'
import type { SetNextTransactionsFailed, SetTransaction } from 'components'


type SubmitInput = {
  setTransaction: SetTransaction
  setNextTransactionsFailed: SetNextTransactionsFailed
}

type Input = {
  step: StakeStep
  field: Forms.Field<bigint>
  tokenAddress: string | null
  recipient: string
  skip?: boolean
}

const useStakeApprove = (values: Input) => {
  const { step, field, tokenAddress, recipient, skip } = values

  const [ isApproveRequired, setApproveRequired ] = useState(false)

  const { allowance, isFetching, getGas, approve, checkAllowance } = useApprove({
    tokenAddress: tokenAddress || '',
    recipient,
    skip,
  })

  const handleApproveRequired = useCallback((amountField: Forms.Field<bigint>) => {
    if (skip) {
      return
    }

    const amount = amountField.value || 0n

    setApproveRequired(amount > allowance)
  }, [ allowance, skip, setApproveRequired ])

  const handleApprove = useCallback(async (values: SubmitInput) => {
    const { setTransaction, setNextTransactionsFailed } = values

    try {
      setTransaction(step, Transactions.Status.Confirm)

      const hash = await approve()

      setTransaction(step, Transactions.Status.Processing)

      await checkAllowance({ hash, allowance })

      setTransaction(step, Transactions.Status.Success)
    }
    catch (error) {
      setNextTransactionsFailed(step)

      return Promise.reject(error)
    }
  }, [ step, allowance, approve, checkAllowance ])

  useFieldListener(field, handleApproveRequired)

  useEffect(() => {
    if (skip) {
      setApproveRequired(false)
    }
  }, [ skip ])

  useEffect(() => {
    handleApproveRequired(field)
  }, [ field, handleApproveRequired ])

  return useMemo(() => ({
    isApproveRequired,
    isAllowanceFetching: isFetching,
    getApproveGas: getGas,
    approve: handleApprove,
  }), [
    isFetching,
    isApproveRequired,
    getGas,
    handleApprove,
  ])
}


export default useStakeApprove
