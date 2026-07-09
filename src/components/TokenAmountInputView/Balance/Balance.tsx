import React from 'react'
import { methods } from 'helpers'
import device from 'modules/device'

import Bone from '../../Bone/Bone'
import Text from '../../Text/Text'
import ButtonBase from '../../ButtonBase/ButtonBase'

import messages from './messages'


export type BalanceProps = {
  title?: Intl.Message
  value?: bigint | string
  disabled?: boolean
  dataTestId?: string
  isFetching?: boolean
  onClick?: () => void
}

const Balance: React.FC<BalanceProps> = (props) => {
  const { title, disabled, value, dataTestId, isFetching, onClick } = props

  const { isDesktop } = device.useData()
  const formattedBalance = methods.formatTokenValue(value || 0n)

  return (
    <div
      className="flex items-end"
      data-testid={dataTestId}
    >
      {
        isFetching ? (
          <Bone
            textSize={isDesktop ? 'sm' : 'xs'}
            w={140}
          />
        ) : (
          <>
            <Text
              className="whitespace-nowrap opacity-70"
              message={{
                ...(title || messages.balance),
                values: {
                  balance: formattedBalance,
                },
              }}
              size={isDesktop ? 'sm' : 'xs'}
              color="dark"
            />
            {
              Boolean(Number(value)) && typeof onClick === 'function' && (
                <ButtonBase
                  className="ml-8 hover:opacity-90 font-bold"
                  disabled={disabled}
                  type="button"
                  dataTestId="max-button"
                  ariaLabel={messages.setMaxValue}
                  onClick={onClick}
                >
                  <Text
                    message="Max"
                    color="primary"
                    size={isDesktop ? 'sm' : 'xs'}
                  />
                </ButtonBase>
              )
            }
          </>
        )
      }
    </div>
  )
}

export default React.memo(Balance)
