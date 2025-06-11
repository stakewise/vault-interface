import { Transaction, TransactionStatus } from './util'


export type SetTransaction = (id: string | number, status: TransactionStatus) => void

export type StepData = Partial<Pick<Transaction, 'id' | 'title' | 'onCancel'>>

export type StepsData = StepData[]
