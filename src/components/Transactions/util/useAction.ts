import { useCallback } from 'react'

import { SetTransaction } from '../types'
import { TransactionStatus } from './useLogic'


type ActionInput = {
  step: string | number
  cancelErrors?: string[]
  isConfirmOptional?: boolean
  action: () => Promise<string>
  confirm: (values: { hash: string }) => Promise<void>
  setTransaction: SetTransaction
}

const useAction = () => {
  return useCallback(async (values: ActionInput) => {
    const { step, cancelErrors, isConfirmOptional, action, confirm, setTransaction } = values

    try {
      setTransaction(step, TransactionStatus.Confirm)

      const hash = await action()

      if (!hash && !isConfirmOptional) {
        return Promise.reject('No transaction hash returned')
      }

      setTransaction(step, TransactionStatus.Processing)

      await confirm({ hash })

      setTransaction(step, TransactionStatus.Success)
    }
    catch (error: any) {
      const isUserRejected = /user rejected action/.test(error?.message || '')
      const isCancel = isUserRejected || cancelErrors?.includes(error)

      setTransaction(step, isCancel ? TransactionStatus.Cancel : TransactionStatus.Fail, true)

      error.isCancel = isCancel

      return Promise.reject(error)
    }
  }, [])
}


export default useAction
