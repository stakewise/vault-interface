import React from 'react'

import { Icon, TokenAmount, TokenAmountProps } from 'components'


export type TokenValueProps = {
  next: {
    value: bigint | null
    color?: TokenAmountProps['textColor']
    dataTestId?: string
  }
  prev: {
    value: bigint
    color?: TokenAmountProps['textColor']
    dataTestId?: string
  }
  token: Tokens
}

const TokenValue: React.FC<TokenValueProps> = (props) => {
  const { token, prev, next } = props

  return (
    <div className="flex items-center justify-between">
      <TokenAmount
        textColor={prev.color || 'dark'}
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
              color="dark"
              size={16}
            />
            <TokenAmount
              value={next.value as bigint}
              textColor={next.color || 'dark'}
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
