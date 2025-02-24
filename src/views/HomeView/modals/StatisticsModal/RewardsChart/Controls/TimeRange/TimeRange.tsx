import React from 'react'
import cx from 'classnames'

import type { SelectProps } from 'components'
import { ButtonRangePicker } from 'components'


type TimeRangeProps = {
  className?: string
  field: Forms.Field<string>
  range: SelectProps['options']
}

const TimeRange: React.FC<TimeRangeProps> = (props) => {
  const { className, field, range } = props

  if (!range.length) {
    return null
  }

  return (
    <ButtonRangePicker
      className={cx(className, 'h-[30rem]')}
      field={field}
      range={range}
      dataTestId="stake-chart-time-range"
    />
  )
}


export default React.memo(TimeRange)
