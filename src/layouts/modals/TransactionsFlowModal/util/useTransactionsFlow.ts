import { useMemo } from 'react'
import { Transaction, Transactions } from 'components'

import steps from './steps'
import { TransactionsFlow, StepsData } from '../types'


type Input = {
  flow: TransactionsFlow
  stepsData?: StepsData
}

const useTransactionsFlow = ({ flow, stepsData }: Input) => {
  const flowSteps = useMemo(() => {
    let result = steps[flow]

    if (stepsData) {
      const stepsById: Record<Transaction['id'], Transaction> = {}

      steps[flow].forEach((step) => {
        stepsById[step.id] = step
      })

      result = stepsData
        .map((stepData, index) => {
          const defaultStepData = stepsById[stepData.id as keyof typeof stepsById]

          return {
            ...defaultStepData,
            ...stepData,
            status: index ? defaultStepData.status : Transactions.Status.Confirm,
          }
        })
    }

    return result
  }, [ flow, stepsData ])

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
