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
  loading?: boolean
  balance: {
    title?: Intl.Message
    value?: bigint
    token: Tokens
    units?: number
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
    loading,
    balance,
    tokenNode,
    dataTestId,
    bottomNode,
    onChange,
    onMaxButtonClick,
  } = props

  const { isMobile } = device.useData()
  const { error } = forms.useFieldValue(field)
  const { formattedValue, handleChange, setSpecialFormat } = useSpecialFormat({
    field,
    units: balance.units || 18,
  })

  return (
    <div
      className={cx(className, {
        'opacity-50': loading,
      })}
    >
      {
        Boolean(label) && (
          <Text
            className="mb-16"
            message={label as string}
            size={isMobile ? 't12' : 't14m'}
            color="dark"
            dataTestId={dataTestId ? `${dataTestId}-label` : ''}
          />
        )
      }
      <div className="pt-16 px-16 pb-8 flex flex-col bg-dark/5 rounded-8">
        <div
          className={cx('mb-16 flex justify-between items-center w-full', {
            'pt-8': isMobile,
          })}
        >
          <Input
            className="flex-1"
            value={formattedValue}
            error={Boolean(error)}
            disabled={loading || !balance.value}
            isRequired={field.isRequired}
            dataTestId={dataTestId}
            onChange={(value: string) => {
              if (loading) {
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
            'justify-between' : !isMobile,
            'justify-end' : isMobile,
          })}
        >
          {
            !isMobile && (
              <FiatAmount
                amount={formattedValue || '0'}
                token={balance.token}
                color="secondary"
                size="t14"
              />
            )
          }
          {
            typeof onMaxButtonClick === 'function' && (
              <Balance
                loading={loading}
                title={balance.title}
                value={formatUnits(balance.value || 0n, balance.units || 18)}
                dataTestId={dataTestId ? `${dataTestId}-balance` : ''}
                onClick={() => {
                  setSpecialFormat(null)
                  onMaxButtonClick()
                }}
              />
            )
          }
        </div>
        {bottomNode}
        {
          error && (
            <Text
              className="flex-1 mt-6"
              message={error}
              size="t14m"
              color="error"
            />
          )
        }
      </div>
    </div>
  )
}


export default React.memo(TokenAmountInputView)
