import { useCallback, useEffect, useMemo, useState } from 'react'
import { StakeStep } from 'helpers/enums'
import { useApprove, useFieldListener } from 'hooks'

import type { SetTransaction } from 'components'
import { Transactions } from 'components'


type SubmitInput = {
  setTransaction: SetTransaction
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

  const wrapTransaction = Transactions.useAction()

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
    const { setTransaction } = values

    await wrapTransaction({
      step,
      action: approve,
      confirm: ({ hash }) => checkAllowance({ hash, allowance }),
      setTransaction,
    })
  }, [ step, allowance, approve, checkAllowance, wrapTransaction ])

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
