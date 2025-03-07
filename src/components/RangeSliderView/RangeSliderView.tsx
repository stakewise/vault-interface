import React, { useCallback } from 'react'
import cx from 'classnames'

import { useFocus, useSlider } from './util'

import s from './RangeSliderView.module.scss'


export type RangeSliderViewProps = {
  className?: string
  min?: number
  max?: number
  step?: number
  value: number
  color?: 'success' | 'warning' | 'error' | 'errorInverted'
  disabled?: boolean
  dataTestId?: string
  ariaLabelledBy?: string
  onChange: (value: number) => void
}

const RangeSliderView: React.FC<RangeSliderViewProps> = (props: RangeSliderViewProps) => {
  const {
    className, min = 0, max = 100, step = 1, value, color = 'success', disabled,
    dataTestId, ariaLabelledBy, onChange,
  } = props

  const setValue = useCallback((value: number) => {
    if (!disabled) {
      onChange(value)
    }
  }, [ disabled, onChange ])

  const { onBlur, onFocus } = useFocus({
    min,
    max,
    step,
    value,
    setValue,
  })

  const { isGrabbing, trackRef, thumbRef } = useSlider({
    min,
    max,
    step,
    setValue,
  })

  const percent = Math.min((value - min) / (max - min) * 100, 100)
  const thumbStyle = { left: `calc(${percent}% - ${25 * percent / 100}rem)` }

  return (
    <div
      className={cx(className, s[color], 'py-8', {
        'opacity-50': disabled,
        'cursor-grabbing': isGrabbing && !disabled,
      })}
    >
      <div className={cx(s.trackLine, 'bg-white/05 rounded-2 relative')}>
        <div
          className={cx(s.fill, 'absolute left-0 top-0 rounded-2')}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        ref={trackRef}
        className={cx(s.track, 'relative')}
      >
        <div
          ref={thumbRef}
          className={cx(s.thumb, 'bg-success-light rounded-full absolute z-1', {
            'cursor-grab': !isGrabbing && !disabled,
          })}
          tabIndex={0}
          style={thumbStyle}
          aria-valuemin={min}
          aria-valuenow={value}
          aria-valuemax={max}
          aria-labelledby={ariaLabelledBy}
          data-testid={dataTestId}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
    </div>
  )
}


export default React.memo(RangeSliderView)
