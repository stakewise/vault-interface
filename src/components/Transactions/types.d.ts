import { Transaction, TransactionStatus } from './util'


export type SetTransaction = (id: string | number, status: TransactionStatus, next?: boolean) => void

export type StepData = Partial<Pick<Transaction, 'id' | 'title' | 'onCancel'>>

export type StepsData = StepData[]
