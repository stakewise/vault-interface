import React, { useMemo } from 'react'
import cx from 'classnames'
import { useTabButton } from 'sw-hooks'
import forms from 'sw-modules/forms'

import Text from '../Text/Text'
import ButtonBase from '../ButtonBase/ButtonBase'
import type { SelectProps } from '../Select/Select'

import s from './ButtonRangePicker.module.scss'
import messages from './messages'


export type ButtonRangePickerProps = {
  className?: string
  dataTestId?: string
  field: Forms.Field<string>
  range: SelectProps['options']
}

const ButtonRangePicker: React.FC<ButtonRangePickerProps> = (props) => {
  const { className, field, dataTestId, range } = props

  const { value } = forms.useFieldValue(field)

  const activeIndex = useMemo(() => {
    return range.findIndex((item) => item.value === value)
  }, [ range, value ])

  const { tabButtonRef, containerRef } = useTabButton({
    index: activeIndex,
  })

  return (
    <div
      ref={containerRef}
      className={cx(
        className,
        'relative',
        'flex rounded-12 border border-secondary/10'
      )}
      data-testid={dataTestId}
    >
      {
        range.map((item, index) => (
          <ButtonBase
            key={item.value}
            className={cx(s.rounded, 'py-4 px-8')}
            dataTestId={`${dataTestId}-button`}
            ariaLabel={messages.buttonRange}
            onClick={() => field.setValue(item.value)}
          >
            <Text
              className={cx('hover:opacity-100', {
                'opacity-50': index !== activeIndex,
              })}
              message={item.title || ''}
              color="dark"
              size="t14m"
            />
          </ButtonBase>
        ))
      }
      <div
        ref={tabButtonRef}
        className={cx(
          s.rounded,
          'bg-dark/03 py-4 px-8',
          'absolute top-0 left-0 transition-all duration-200 pointer-events-none'
        )}
      />
    </div>
  )
}


export default React.memo(ButtonRangePicker)
