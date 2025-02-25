import React, { useCallback, useState } from 'react'
import { formatEther, parseEther } from 'ethers'
import forms from 'sw-modules/forms'

import InputView from './InputView/InputView'


export type InputProps = {
  className?: string
  disabled?: boolean
  multiline?: number
  autoFocus?: boolean
  dataTestId?: string
  withCrossButton?: boolean
  withChangeValue?: boolean
  label?: Intl.Message | string
  description?: Intl.Message | string
  buttonTitle?: Intl.Message | string
  field: Forms.Field<string | bigint>
  secondaryButtonTitle?: Intl.Message | string
  onChange?: (value: Forms.FieldValue) => void
  onSecondaryButtonClick?: () => void
  onButtonClick?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

const Input: React.FC<InputProps> = (props) => {
  const {
    className, field, label, disabled, autoFocus, dataTestId,
    buttonTitle, description, secondaryButtonTitle, multiline,

    withCrossButton = true,
    withChangeValue = true,

    onButtonClick, onSecondaryButtonClick, onChange, onFocus, onBlur, ...otherProps
  } = props

  const [ dot, setDot ] = useState(false)
  const { value, error } = forms.useFieldValue(field)

  const handleChange = useCallback((value: string) => {
    if (typeof onChange === 'function') {
      onChange(value)
    }

    if (withChangeValue) {
      if (value === undefined) {
        field.setValue(value)

        return
      }

      if (field.isBigInt) {
        if (!value) {
          field.setValue(undefined)

          return
        }

        const isValid = /^\d+\.?\d*$/.test(value)

        if (value[value.length - 1] === '.') {
          setDot(true)
        }
        else {
          setDot(false)
        }

        if (!isValid) {
          return
        }

        const result = parseEther(value)

        field.setValue(result)
      }
      else {
        field.setValue(value)
      }
    }
  }, [ field, withChangeValue, onChange ])

  const handleCrossClick = withCrossButton
    ? () => field.reset()
    : undefined

  if (!field.isString && !field.isBigInt) {
    throw new Error('Input should work with bigint or string field')
  }

  const formattedValue: string | undefined = (() => {
    if (value === undefined) {
      return value
    }

    if (field.isBigInt) {
      const result = formatEther(value as bigint).replace(/\.0+$/, '')

      return dot ? `${result}.` : result
    }

    return field.value as string
  })()

  return (
    <InputView
      className={className}
      error={error}
      label={label}
      disabled={disabled}
      multiline={multiline}
      autoFocus={autoFocus}
      value={formattedValue}
      dataTestId={dataTestId}
      buttonTitle={buttonTitle}
      description={description}
      isRequired={field.isRequired}
      secondaryButtonTitle={secondaryButtonTitle}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={handleChange}
      onButtonClick={onButtonClick}
      onCrossClick={handleCrossClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      {...otherProps}
    />
  )
}


export default React.memo(Input)
