import { useMemo } from 'react'
import { TransactionStatus, Transaction } from '../../../../components/Transactions/util'
import Transactions from '../../../../components/Transactions/Transactions'

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
      const stepsById: Record<Transaction['id'], Omit<Transaction, 'status'>> = {}

      steps[flow].forEach((step) => {
        stepsById[step.id] = step
      })

      result = stepsData
        .map((stepData) => {
          const defaultStepData = stepsById[stepData.id as keyof typeof stepsById]

          return {
            ...defaultStepData,
            ...stepData,
          }
        })
    }

    return result.map((step, index) => ({
      ...step,
      status: index ? TransactionStatus.Waiting : TransactionStatus.Confirm,
    }))
  }, [ flow, stepsData ])

  const {
    transactions,
    setTransaction,
    resetTransactions,
    setNextTransactionsFailed,
  } = Transactions.useLogic(flowSteps)

  return useMemo(() => ({
    transactions,
    setTransaction,
    resetTransactions,
    setNextTransactionsFailed,
  }), [
    transactions,
    setTransaction,
    resetTransactions,
    setNextTransactionsFailed,
  ])
}


export default useTransactionsFlow
