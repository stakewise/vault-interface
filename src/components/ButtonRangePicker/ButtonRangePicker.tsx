import React, { useMemo } from 'react'
import { useTabButton } from 'hooks'
import theme from 'modules/theme'
import forms from 'modules/forms'
import cx from 'classnames'

import Text from '../Text/Text'
import ButtonBase from '../ButtonBase/ButtonBase'
import type { SelectProps } from '../Select/Select'

import messages from './messages'


export type ButtonRangePickerProps = {
  className?: string
  dataTestId?: string
  field: Forms.Field<string>
  range: SelectProps['options']
}

const ButtonRangePicker: React.FC<ButtonRangePickerProps> = (props) => {
  const { className, field, dataTestId, range } = props

  const { isDark } = theme.useData()
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
        'flex rounded-16 border border-dark/10'
      )}
      data-testid={dataTestId}
    >
      {
        range.map((item, index) => (
          <ButtonBase
            key={item.value}
            className="rounded-16 py-4 px-8"
            dataTestId={`${dataTestId}-button`}
            ariaLabel={messages.buttonRange}
            onClick={() => field.setValue(item.value)}
          >
            <Text
              className={cx('hover:opacity-100 font-medium', {
                'opacity-50': index !== activeIndex,
              })}
              message={item.title || ''}
              color="dark"
              size="sm"
            />
          </ButtonBase>
        ))
      }
      <div
        ref={tabButtonRef}
        className={cx('absolute py-4 px-8 rounded-16 top-0 left-0 transition-all duration-200 pointer-events-none',{
          'bg-white/25': isDark,
          'bg-dark/10': !isDark,
        })}
      />
    </div>
  )
}


export default React.memo(ButtonRangePicker)
