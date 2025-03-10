export type ActionType = 'stake' | 'unstake' | 'mint' | 'burn' | 'boost' | 'unboost'

export type Input = {
  field: Forms.Field<bigint | string>
  type: ActionType
}

type TokenValueStatus = {
  value: bigint | null
  dataTestId?: string
}

type TextValueStatus = {
  color?: string
  message?: string
  dataTestId?: string
}

export type Position = {
  title: Intl.Message | string
  tooltip?: Intl.Message
  hidden?: boolean
  isFetching?: boolean
  tokenValue?: {
    token: Tokens
    prev: TokenValueStatus
    next: TokenValueStatus
  }
  textValue?: {
    prev: TextValueStatus
    next: TextValueStatus
  }
}
