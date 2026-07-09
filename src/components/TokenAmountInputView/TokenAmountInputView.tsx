import React, { ReactNode } from 'react'
import cx from 'classnames'
import forms from 'modules/forms'
import device from 'modules/device'
import { formatUnits } from 'ethers'

import Text from '../Text/Text'

import Input from './Input/Input'
import Balance from './Balance/Balance'
import FiatAmount from '../FiatAmount/FiatAmount'

import { useSpecialFormat } from './util'


export type TokenAmountInputViewProps = {
  className?: string
  field: Forms.Field<string | bigint>
  label?: Intl.Message | string
  disabled?: boolean
  balance: {
    title?: Intl.Message
    value?: bigint
    token: Tokens
    units?: number
    hidden?: boolean
    isFetching?: boolean
  }
  dataTestId?: string
  tokenNode: ReactNode
  bottomNode?: ReactNode
  onChange?: (value: string | bigint) => void
  onMaxButtonClick?: () => void
}

const TokenAmountInputView: React.FC<TokenAmountInputViewProps> = (props) => {
  const {
    className,
    label,
    field,
    disabled,
    balance,
    tokenNode,
    dataTestId,
    bottomNode,
    onChange,
    onMaxButtonClick,
  } = props

  const { isDesktop } = device.useData()
  const { error } = forms.useFieldValue(field)
  const { formattedValue, handleChange, setSpecialFormat } = useSpecialFormat({
    field,
    units: balance.units || 18,
  })

  return (
    <div
      className={className}
    >
      {
        Boolean(label) && (
          <Text
            className={cx('mb-16', {
              'font-medium': isDesktop,
              'opacity-50': disabled,
            })}
            message={label as string}
            size={!isDesktop ? 'xs' : 'sm'}
            color="dark"
            dataTestId={dataTestId ? `${dataTestId}-label` : ''}
          />
        )
      }
      <div
        className={cx('pt-16 px-16 pb-8 flex flex-col bg-dark/5 rounded-8', {
          'opacity-30': disabled,
        })}
      >
        <div
          className={cx('mb-16 flex justify-between items-center w-full', {
            'pt-8': !isDesktop,
          })}
        >
          <Input
            className={cx('flex-1', {
              'opacity-50': disabled,
            })}
            value={formattedValue}
            error={Boolean(error)}
            disabled={disabled || !balance.value}
            isRequired={field.isRequired}
            dataTestId={dataTestId}
            onChange={(value: string) => {
              if (disabled) {
                return
              }

              handleChange(value)

              if (typeof onChange === 'function') {
                onChange(value)
              }
            }}
          />
          {tokenNode}
        </div>
        <div
          className={cx('flex items-end w-full', {
            'justify-between' : isDesktop,
            'justify-end' : !isDesktop,
            'opacity-50': disabled,
          })}
        >
          {
            isDesktop && (
              <FiatAmount
                className="opacity-70"
                amount={formattedValue || '0'}
                token={balance.token}
                color="dark"
                size="sm"
              />
            )
          }
          {
            !balance.hidden && (
              <Balance
                disabled={disabled}
                title={balance.title}
                value={formatUnits(balance.value || 0n, balance.units || 18)}
                isFetching={balance.isFetching}
                dataTestId={dataTestId ? `${dataTestId}-balance` : ''}
                onClick={(
                  typeof onMaxButtonClick === 'function'
                    ? () => {
                      setSpecialFormat(null)
                      onMaxButtonClick()
                    }
                    : undefined
                )}
              />
            )
          }
        </div>
        {bottomNode}
        {
          error && (
            <Text
              className="flex-1 mt-6 font-medium"
              message={error}
              size="sm"
              color="error"
            />
          )
        }
      </div>
    </div>
  )
}


export default React.memo(TokenAmountInputView)
