export type TransactionsFlow = 'boost' | 'stake' | 'unstake'

export type StepData = {
  title?: Intl.Message
  onCancel?: () => void
}

export type StepsData = Record<string, StepData>
