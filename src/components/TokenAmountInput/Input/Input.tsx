import React, { RefObject, useCallback } from 'react'
import methods from 'sw-methods'

import AmountInput from '../../AmountInput/AmountInput'


type InputProps = {
  className?: string
  value?: string
  error?: boolean
  disabled?: boolean
  dataTestId?: string
  isRequired?: boolean
  onChange: (value: string) => void
}

const formatValue = (value: string | undefined) => {
  if (value === undefined) {
    return ''
  }

  const parts = value.split('.')
  parts[0] = methods.addNumberSeparator(parts[0])

  return parts.join(".")
}

const Input: React.FC<InputProps> = (props) => {
  const {
    value,
    error,
    disabled,
    className,
    isRequired,
    dataTestId,
    onChange,
  } = props

  const handleChange = useCallback((value: string, inputRef: RefObject<HTMLInputElement>) => {
    const valueWithOutCommas = value.replace(/,/g, '')
    const cursorPositionBeforeChange = inputRef.current?.selectionStart || 0
    const newValue = formatValue(valueWithOutCommas)
    const diff = newValue.length - value.length

    // Set cursor position after the value change
    setTimeout(() => {
      inputRef.current?.setSelectionRange(cursorPositionBeforeChange + diff, cursorPositionBeforeChange + diff)
    }, 0)

    if (typeof onChange === 'function') {
      onChange(valueWithOutCommas)
    }
  }, [ onChange ])

  return (
    <AmountInput
      className={className}
      error={error}
      disabled={disabled}
      dataTestId={dataTestId}
      isRequired={isRequired}
      value={formatValue(value)}
      onChange={handleChange}
    />
  )
}


export default React.memo(Input)
