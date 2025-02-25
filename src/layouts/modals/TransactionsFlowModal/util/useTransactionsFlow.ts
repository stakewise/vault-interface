import { useMemo } from 'react'
import { useConfig } from 'config'
import { UnstakeStep } from 'helpers/enums'
import { commonMessages } from 'helpers'

import { Transactions } from 'components'

import steps from './steps'
import { TransactionsFlow } from '../types'


type Input = {
  flow: TransactionsFlow
  availableSteps?: string[]
}

const useTransactionsFlow = ({ flow, availableSteps }: Input) => {
  const { sdk } = useConfig()

  const unstakeApproveStep = useMemo(() => ({
    id: UnstakeStep.Approve,
    status: Transactions.Status.Confirm,
    title: {
      ...commonMessages.buttonTitle.approve,
      values: {
        token: sdk.config.tokens.mintToken,
      },
    },
    testId: 'step-approve',
  }), [ sdk ])

  const flowSteps = useMemo(() => {
    let result = steps[flow]

    if (flow === 'unstake') {
      result = [ unstakeApproveStep, ...result ]
    }

    if (availableSteps) {
      return result
        .filter((step) => availableSteps.includes(step.id as string))
        .map((step, index) => ({
          ...step,
          status: index ? step.status : Transactions.Status.Confirm,
        }))
    }

    return result
  }, [ flow, availableSteps, unstakeApproveStep ])

  const { transactions, setTransaction, resetTransactions } = Transactions.useLogic(flowSteps)

  return useMemo(() => ({
    transactions,
    setTransaction,
    resetTransactions,
  }), [
    transactions,
    setTransaction,
    resetTransactions,
  ])
}


export default useTransactionsFlow
