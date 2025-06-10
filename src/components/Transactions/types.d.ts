import { TransactionStatus } from './util'


export type SetTransaction = (id: string | number, status: TransactionStatus) => void

export type StepData = {
  title?: Intl.Message
  onCancel?: () => void
}

export type StepsData = Record<string, StepData>
