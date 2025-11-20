import { useCallback, useMemo, useState } from 'react'
import type { SetNextTransactionsFailed } from 'components'

import type { SetTransaction } from '../types'


export enum TransactionStatus {
  Fail,
  Cancel,
  Success,
  Waiting,
  Confirm,
  Canceling,
  Processing,
}

export type Transaction = {
  id: number | string
  title: Intl.Message | string
  status: TransactionStatus
  testId?: string
  onCancel?: (props: { setTransaction: SetTransaction }) => void
}

export type ModifiedTransaction = Omit<Transaction, 'onCancel'> & {
  onCancel?: () => void
}

const useLogic = (initialTransactions: Transaction[] = []) => {
  const [ transactions, setTransactions ] = useState<Transaction[]>(initialTransactions)

  const setTransaction: SetTransaction = useCallback((id, status) => {
    setTransactions((steps) => {
      return steps.map((step) => {
        if (step.id === id) {
          return {
            ...step,
            status,
          }
        }

        return step
      })
    })
  }, [])

  const resetTransactions = useCallback(() => {
    setTransactions(initialTransactions)
  }, [ initialTransactions ])

  const setNextTransactionsFailed: SetNextTransactionsFailed = useCallback((id) => {
    setTransactions((steps) => {
      const failedIndex = steps.findIndex((step) => step.id === id)

      if (failedIndex === -1) {
        return steps
      }

      return steps.map((step, index) => {
        if (index >= failedIndex) {
          return {
            ...step,
            status: TransactionStatus.Fail,
          }
        }

        return step
      })
    })
  }, [])

  return useMemo(() => ({
    transactions: transactions.map(({ onCancel, ...transaction }) => ({
      ...transaction,
      onCancel: typeof onCancel === 'function'
        ? () => onCancel({ setTransaction })
        : undefined,
    })),
    setTransaction,
    setTransactions,
    resetTransactions,
    setNextTransactionsFailed,
  }), [
    transactions,
    setTransaction,
    setTransactions,
    resetTransactions,
    setNextTransactionsFailed,
  ])
}


export default useLogic
