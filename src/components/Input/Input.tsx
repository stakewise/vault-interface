import React, { useCallback, useState } from 'react'
import { formatEther, parseEther } from 'ethers'
import forms from 'sw-modules/forms'

import InputView, { InputViewProps } from './InputView/InputView'


export type InputProps = Omit<InputViewProps, 'value'> & {
  withCrossButton?: boolean
  withChangeValue?: boolean
  field: Forms.Field<string | bigint>
  onChange?: (value: Forms.FieldValue) => void
}

const Input: React.FC<InputProps> = (props) => {
  const {
    className, field, label, disabled, autoFocus, dataTestId,
    buttonTitle, description, secondaryButtonTitle, multiline,
    elementClassName,

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
      elementClassName={elementClassName}
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
