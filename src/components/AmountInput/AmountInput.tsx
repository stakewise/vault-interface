import React, { RefObject, useId, useRef } from 'react'
import device from 'modules/device'
import cx from 'classnames'

import s from './AmountInput.module.scss'


export type AmountInputProps = {
  className?: string
  value?: string
  error?: boolean
  disabled?: boolean
  dataTestId?: string
  isRequired?: boolean
  onBlur?: () => void
  onChange: (value: string, inputRef: RefObject<HTMLInputElement>) => void
}

const AmountInput: React.FC<AmountInputProps> = (props) => {
  const {
    value,
    error,
    disabled,
    className,
    isRequired,
    dataTestId,
    onBlur,
    onChange,
  } = props

  const controlId = useId()
  const { isMobile } = device.useData()
  const testId = dataTestId || `input-${controlId}`
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <input
      className={cx(s.input, className, 'w-full', {
        'text-dark': !error,
        'text-error': error,
        'text-h20': isMobile,
        'text-t40m': !isMobile,
      })}
      ref={inputRef}
      placeholder="0"
      value={value}
      disabled={disabled}
      data-testid={testId}
      required={isRequired}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value, inputRef)}
    />
  )
}


export default React.memo(AmountInput)
