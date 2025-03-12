import React, { RefObject, useCallback } from 'react'
import cx from 'classnames'
import forms from 'sw-modules/forms'
import device from 'sw-modules/device'
import { commonMessages } from 'helpers'

import Text from '../Text/Text'
import ButtonBase from '../ButtonBase/ButtonBase'
import AmountInput from '../AmountInput/AmountInput'
import RangeSliderView from '../RangeSliderView/RangeSliderView'


const rangeButtons = [
  {
    value: '25',
    title: '25%',
  },
  {
    value: '50',
    title: '50%',
  },
  {
    value: '75',
    title: '75%',
  },
  {
    value: '100',
    title: commonMessages.buttonTitle.max,
  },
]

export type PercentInputProps = {
  field: Forms.Field<string>
  isDisabled?: boolean
  dataTestId?: string
}

const PercentInput: React.FC<PercentInputProps> = ({ field, isDisabled, dataTestId }) => {
  const { isMobile } = device.useData()

  const { value, error } = forms.useFieldValue(field)

  const formatValue = useCallback((value: string, withoutDot?: boolean) => {
    const oldValue = field.value || ''

    const newValue = value.replace(/%/g, '')
    const baseValue = newValue.split('.').filter(Boolean).join('.')
    const isValidValue = /^(\d+)?(\.\d\d?)?$/.test(baseValue)
    const isDotAdded = /\.$/.test(newValue)

    if (isValidValue) {
      if (baseValue) {
        const numberValue = Number(baseValue)

        if (numberValue >= 100) {
          return numberValue === 100 ? String(numberValue) : oldValue
        }

        if (isDotAdded && !withoutDot) {
          return newValue
        }

        return String(numberValue)
      }

      return ''
    }

    return oldValue
  }, [ field ])

  const handleBlur = useCallback(() => {
    const formattedValue = formatValue(field.value || '', true)

    field.setValue(formattedValue)
  }, [ field, formatValue ])

  const handleChange = useCallback((value: string, inputRef: RefObject<HTMLInputElement>) => {
    const oldValue = field.value || ''
    const newValue = formatValue(value)
    const cursorPosition = inputRef.current?.selectionStart || 0
    const isPercentRemoved = !/%$/.test(value)

    let newCursorPosition = cursorPosition

    if (oldValue !== newValue) {
      const diff = newValue.length - oldValue.length
      const isValueAdded = oldValue.length < newValue.length

      // Set cursor position after the value change
      newCursorPosition = isValueAdded
        ? cursorPosition + (diff - 1)
        : cursorPosition + (diff + 1)

      field.setValue(newValue)
    }
    else {
      // Set cursor to the position before %
      newCursorPosition = isPercentRemoved ? cursorPosition : cursorPosition - 1
    }

    setTimeout(() => {
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)
  }, [ field, formatValue ])

  return (
    <div
      className="pt-16 px-16 pb-12 flex flex-col justify-between bg-dark/05 rounded-8 h-[108rem]"
      data-testid={dataTestId}
    >
      <div
        className={cx('flex justify-between items-center w-full gap-8', {
          'pt-8': isMobile,
        })}
      >
        <AmountInput
          className="flex-1"
          value={value ? `${value}%` : ''}
          error={Boolean(error)}
          disabled={isDisabled}
          isRequired={field.isRequired}
          dataTestId={dataTestId ? `${dataTestId}-input` : undefined}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <div className="flex gap-8">
          {
            rangeButtons.map(({ title, value }, index) => (
              <ButtonBase
                key={index}
                className="opacity-50 hover:opacity-100 bg-dark/10 px-12 py-6 rounded-16 h-32"
                disabled={isDisabled}
                dataTestId={`percent-${value}`}
                onClick={() => field.setValue(value)}
              >
                <Text
                  color="dark"
                  message={title}
                  size="t14m"
                />
              </ButtonBase>
            ))
          }
        </div>
      </div>
      <RangeSliderView
        step={0.01}
        color="errorInverted"
        value={parseInt(value || '0')}
        disabled={isDisabled}
        onChange={(value) => field.setValue(value.toFixed())}
      />
    </div>
  )
}


export default React.memo(PercentInput)
