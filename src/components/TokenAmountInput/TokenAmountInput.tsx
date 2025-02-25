import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import forms from 'sw-modules/forms'
import device from 'sw-modules/device'
import { formatEther, parseEther } from 'ethers'

import Text from '../Text/Text'
import type { TokenAmountProps } from '../TokenAmount/TokenAmount'

import Token from './Token/Token'
import Input from './Input/Input'
import Balance from './Balance/Balance'
import FiatAmount from '../FiatAmount/FiatAmount'


export type TokenAmountInputProps = {
  className?: string
  loading?: boolean
  dataTestId?: string
  tokenBalance?: bigint
  balanceTitle?: Intl.Message
  bottomNode?: React.ReactNode
  label?: Intl.Message | string
  token: TokenAmountProps['token']
  field: Forms.Field<string | bigint>
  onChange?: (value: string | bigint) => void
  onMaxButtonClick?: () => void
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = (props) => {
  const {
    className,
    label,
    field,
    token,
    loading,
    dataTestId,
    tokenBalance,
    bottomNode,
    balanceTitle,
    onChange,
    onMaxButtonClick,
  } = props

  const { isMobile } = device.useData()
  const { value, error } = forms.useFieldValue(field)
  const [ inputValueInString, setInputValueInString ] = useState<string>('')
  const [ specialFormat, setSpecialFormat ] = useState<string | null>(null)

  const isEmptyBalance = typeof tokenBalance === 'undefined'

  const handleChange = useCallback((value: string) => {
    if (loading) {
      return
    }

    if (!value) {
      setInputValueInString('')
      field.setValue(undefined)

      return
    }

    if (field.isBigInt) {
      const isValid = /^[0-9]+[.]?[0-9]{0,18}$/.test(value)

      if (!isValid) {
        return
      }

      setInputValueInString(value)

      if (value[value.length - 1] === '.') {
        setSpecialFormat('.')
      }
      else if (/\.0*$/g.test(value)) {
        setSpecialFormat(`.${value.replace(/^.*\./g, '')}`)
      }
      else {
        setSpecialFormat(null)
      }

      const result = parseEther(value)

      field.setValue(result)
    }
    else {
      field.setValue(value)
    }

    if (typeof onChange === 'function') {
      onChange(value)
    }
  }, [ field, loading, onChange ])

  if (!field.isString && !field.isBigInt) {
    throw new Error('TokenAmountInput should work with bigint or string field')
  }

  const formattedValue: string | undefined = (() => {
    if (value === undefined) {
      return value
    }

    if (field.isBigInt) {
      const result = formatEther(value as bigint).replace(/\.0+$/, '')
      const formattedValue = specialFormat ? `${result}${specialFormat}` : result

      const remainder = inputValueInString.replace(formattedValue, '')
      const isRemainderZero = /^0+$/.test(remainder)

      return isRemainderZero ? `${formattedValue}${remainder}` : formattedValue
    }

    return value as string
  })()

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
            color="moon"
            dataTestId={dataTestId ? `${dataTestId}-label` : ''}
          />
        )
      }
      <div className="pt-16 px-16 pb-8 flex flex-col bg-moon/05 rounded-8">
        <div
          className={cx('flex justify-between items-center w-full', {
            'pt-8': isMobile,
          })}
        >
          <Input
            className="flex-1"
            value={formattedValue}
            error={Boolean(error)}
            disabled={loading || !tokenBalance}
            isRequired={field.isRequired}
            dataTestId={dataTestId}
            onChange={handleChange}
          />
          <Token
            className="flex-shrink-0"
            dataTestId={`${dataTestId}-token`}
            token={token}
          />
        </div>
        <div
          className={cx('mt-16 flex items-end w-full', {
            'justify-between' : !isMobile,
            'justify-end' : isMobile,
          })}
        >
          {
            !isMobile && (
              <FiatAmount
                amount={formattedValue || '0'}
                token={token}
                color="stone"
                size="t14"
              />
            )
          }
          {
            !isEmptyBalance && typeof onMaxButtonClick === 'function' && (
              <Balance
                loading={loading}
                title={balanceTitle}
                value={tokenBalance}
                dataTestId={dataTestId ? `${dataTestId}-balance` : ''}
                onClick={onMaxButtonClick}
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
              color="volcano"
            />
          )
        }
      </div>
    </div>
  )
}


export default React.memo(TokenAmountInput)
