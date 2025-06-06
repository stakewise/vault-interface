import { useMemo } from 'react'
import { Transactions } from 'components'

import steps from './steps'
import { TransactionsFlow } from '../types'


type Input = {
  flow: TransactionsFlow
  stepTitles?: Record<string, Intl.Message>
  availableSteps?: string[]
}

const useTransactionsFlow = ({ flow, stepTitles, availableSteps }: Input) => {
  const flowSteps = useMemo(() => {
    let result = steps[flow]

    if (stepTitles) {
      result = result.map((step) => ({
        ...step,
        title: stepTitles[step.id] || step.title,
      }))
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
  }, [ flow, stepTitles, availableSteps ])

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
