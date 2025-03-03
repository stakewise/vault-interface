export type ActionType = 'stake' | 'unstake' | 'mint' | 'burn' | 'boost' | 'unboost'

export type Input = {
  field: Forms.Field<bigint | string>
  type: ActionType
}

export type Position = {
  title: Intl.Message | string
  tooltip?: Intl.Message
  hidden?: boolean
  isFetching?: boolean
  textValue?: {
    prev: {
      message: string
      dataTestId?: string
    }
    next: {
      message?: string
      dataTestId?: string
    }
  }
}
