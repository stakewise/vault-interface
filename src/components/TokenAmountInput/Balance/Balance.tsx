import React from 'react'
import methods from 'sw-methods'
import device from 'sw-modules/device'

import Text from '../../Text/Text'
import ButtonBase from '../../ButtonBase/ButtonBase'

import messages from './messages'


export type BalanceProps = {
  title?: Intl.Message
  value?: bigint
  loading?: boolean
  dataTestId?: string
  onClick?: () => void
}

const Balance: React.FC<BalanceProps> = (props) => {
  const { title, loading, value, dataTestId, onClick } = props

  const { isDesktop } = device.useData()
  const formattedBalance = methods.formatTokenValue(value || 0n)

  return (
    <div
      className="flex items-end"
      data-testid={dataTestId}
    >
      <Text
        className="whitespace-nowrap"
        message={{
          ...(title || messages.balance),
          values: {
            balance: formattedBalance,
          },
        }}
        size={isDesktop ? 't14m' : 't12m'}
        color="stone"
      />
      {
        value && typeof onClick === 'function' && (
          <ButtonBase
            className="ml-8 hover:opacity-90"
            disabled={loading}
            type="button"
            dataTestId="max-button"
            ariaLabel={messages.setMaxValue}
            onClick={onClick}
          >
            <Text
              message="Max"
              color="primary"
              size="t14b"
            />
          </ButtonBase>
        )
      }
    </div>
  )
}

export default React.memo(Balance)
