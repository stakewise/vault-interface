import React, { useCallback, useState } from 'react'
import { formatEther, parseEther } from 'ethers'
import forms from 'modules/forms'
import intl from 'modules/intl'

import InputView, { InputViewProps } from './InputView/InputView'


type InputMask = keyof typeof forms.masks

const applyMask = (value: string, mask: InputMask | undefined): string => {
  if (mask && typeof forms.masks[mask] === 'function') {
    return forms.masks[mask](value)
  }

  return value
}

export type InputProps = Omit<InputViewProps, 'value'> & {
  type?: React.HTMLInputTypeAttribute
  mask?: InputMask
  withCrossButton?: boolean
  withChangeValue?: boolean
  field: Forms.Field<string | bigint>
  onChange?: (value: Forms.FieldValue) => void
}

const Input: React.FC<InputProps> = (props) => {
  const {
    className, field, label, disabled, autoFocus, dataTestId,
    buttonTitle, description, isButtonDisabled, multiline,
    elementClassName, placeholder, isCustomFocus, mask,

    withCrossButton = true,
    withChangeValue = true,

    onButtonClick, onChange, onFocus, onBlur, onEnter, ...otherProps
  } = props

  const [ dot, setDot ] = useState(false)
  const { value, error } = forms.useFieldValue(field)

  const intlRef = intl.useIntlRef()

  const handleChange = useCallback((rawValue: string) => {
    const maskedValue = applyMask(rawValue, mask)

    if (typeof onChange === 'function') {
      onChange(maskedValue)
    }

    if (withChangeValue) {
      if (maskedValue === undefined) {
        field.setValue(maskedValue)

        return
      }

      if (field.isBigInt) {
        if (!maskedValue) {
          field.setValue(undefined)

          return
        }

        const isValid = /^\d+\.?\d*$/.test(maskedValue)

        if (maskedValue[maskedValue.length - 1] === '.') {
          setDot(true)
        }
        else {
          setDot(false)
        }

        if (!isValid) {
          return
        }

        const result = parseEther(maskedValue)

        field.setValue(result)
      }
      else {
        field.setValue(maskedValue)
      }
    }
  }, [ field, withChangeValue, onChange, mask ])

  const handleCrossClick = withCrossButton
    ? () => field.reset()
    : undefined

  if (!field.isString && !field.isBigInt) {
    throw new Error('Input should work with bigint or string field')
  }

  if (label && placeholder) {
    throw new Error('You should use either label or placeholder, not both')
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

  const formattedPlaceholder: Intl.Message | string | undefined = (() => {
    if (placeholder) {
      return intlRef.current.formatMessage(placeholder as Intl.MessageTranslation)
    }
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
      isCustomFocus={isCustomFocus}
      placeholder={formattedPlaceholder}
      isButtonDisabled={isButtonDisabled}
      elementClassName={elementClassName}
      onBlur={onBlur}
      onFocus={onFocus}
      onEnter={onEnter}
      onChange={handleChange}
      onButtonClick={onButtonClick}
      onCrossClick={handleCrossClick}
      {...otherProps}
    />
  )
}


export default React.memo(Input)
