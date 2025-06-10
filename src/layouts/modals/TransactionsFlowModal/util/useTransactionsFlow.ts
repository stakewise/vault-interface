import { useMemo } from 'react'
import { Transactions } from 'sw-components'

import steps from './steps'
import { TransactionsFlow, StepsData } from '../types'


type Input = {
  flow: TransactionsFlow
  stepsData?: StepsData
  availableSteps?: string[]
}

const useTransactionsFlow = ({ flow, stepsData, availableSteps }: Input) => {
  const flowSteps = useMemo(() => {
    let result = steps[flow]

    if (stepsData) {
      result = result.map((step) => ({
        ...step,
        ...stepsData[step.id],
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
  }, [ flow, stepsData, availableSteps ])

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
