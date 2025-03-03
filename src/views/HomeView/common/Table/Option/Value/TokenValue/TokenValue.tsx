import React from 'react'

import { Icon, TokenAmount, TextColor, IconName } from 'components'


export type TokenValueProps = {
  next: {
    value: bigint | null
    color?: TextColor
    dataTestId?: string
  }
  prev: {
    value: bigint
    color?: TextColor
    dataTestId?: string
  }
  token: Tokens
}

const TokenValue: React.FC<TokenValueProps> = (props) => {
  const { token, prev, next } = props

  return (
    <div className="flex items-center justify-between">
      <TokenAmount
        textColor={prev.color || 'moon'}
        value={prev.value}
        token={token}
        size="sm"
        dataTestId={`position-${prev.dataTestId || 'amount'}-prev`}
      />
      {
        typeof next.value === 'bigint' && (
          <>
            <Icon
              className="mx-4"
              name="arrow/right"
              color="moon"
              size={16}
            />
            <TokenAmount
              value={next.value as bigint}
              textColor={next.color || 'moon'}
              token={token}
              size="sm"
              dataTestId={`position-${next.dataTestId || 'amount'}-next`}
            />
          </>
        )
      }
    </div>
  )
}


export default React.memo(TokenValue)
