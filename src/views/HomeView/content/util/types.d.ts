import { IconName, TextProps, TokenAmountProps } from 'components'


export type ActionType = 'stake' | 'unstake' | 'mint' | 'burn' | 'boost' | 'unboost'

export type Input = {
  field: Forms.Field<bigint | string>
  type: ActionType
}

type TokenValue= {
  value: bigint
  color?: TokenAmountProps['textColor']
  dataTestId?: string
}

type TextValue = Partial<TextProps> & {
  icon?: IconName
}

export type Position = {
  title: Intl.Message | string
  tooltip?: Intl.Message
  hidden?: boolean
  isFetching?: boolean
  tokenValue?: {
    token: Tokens
    prev: TokenValue
    next: Omit<TokenValue, 'value'> & {
      value: bigint | null
    }
  }
  textValue?: {
    prev: TextValue
    next: TextValue
  }
}
