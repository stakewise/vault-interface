import { Transaction } from '../../../components'


export type TransactionsFlow = 'boost' | 'stake' | 'unstake' | 'unboost'

export type StepData = Partial<Pick<Transaction, 'id' | 'title' | 'onCancel'>>

export type StepsData = StepData[]
