import { TransactionStatus } from './util'


export type SetTransaction = (id: string | number, status: TransactionStatus) => void
