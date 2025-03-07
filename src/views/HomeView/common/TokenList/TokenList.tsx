import React from 'react'
import cx from 'classnames'

import { TextWithTooltip, TokenAmount, FiatAmount } from 'components'


type Item = {
  token: Tokens
  amount: bigint
  title: Intl.Message | string
  tooltip?: Intl.Message | string
  dataTestId?: string
}

type TokenListProps = {
  className?: string
  items: Item[]
}

const TokenList: React.FC<TokenListProps> = (props) => {
  const { className, items } = props

  return (
    <div className={className}>
      {
        items.map(({ token, title, amount, tooltip, dataTestId }, index) => (
          <div
            key={index}
            className={cx('flex items-center justify-between', {
              'mt-12 pt-12 border-top border-dark/10': index,
            })}
            data-testid={dataTestId}
          >
            <TextWithTooltip
              text={{
                message: title,
                color: 'dark',
                size: 't14m',
              }}
              tooltip={tooltip}
            />
            <div className="text-right">
              <TokenAmount
                value={amount}
                token={token}
                size="sm"
                dataTestId={dataTestId ? `${dataTestId}-amount` : undefined}
              />
              <FiatAmount
                className="mt-4 opacity-60"
                amount={amount}
                token={token}
                color="dark"
                size="t12m"
                dataTestId={dataTestId ? `${dataTestId}-fiat-amount` : undefined}
              />
            </div>
          </div>
        ))
      }
    </div>
  )
}


export default React.memo(TokenList)
