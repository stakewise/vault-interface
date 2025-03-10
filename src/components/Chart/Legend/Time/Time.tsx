import React, { useRef, useCallback } from 'react'
import type { Time } from 'lightweight-charts'
import date from 'sw-modules/date'
import cx from 'classnames'

import Icon from '../../../Icon/Icon'
import Text from '../../../Text/Text'
import { useSubscribe } from '../util'


export type TimeProps = {
  chart: Charts.Chart
  series: Charts.Series
  pointType: Charts.PointType
}

const Time: React.FC<TimeProps> = (props) => {
  const { chart, series, pointType } = props

  const timeTooltipRef = useRef<HTMLDivElement>(null)

  const callback = useCallback((point: Charts.Point) => {
    const { time } = point

    if (timeTooltipRef.current) {
      timeTooltipRef.current.innerHTML = date
        .time(Number(time) * 1000)
        .format('DD MMM YYYY')
    }
  }, [])

  useSubscribe({ chart, series, callback })

  return (
    <div className="flex items-center gap-4 mt-8">
      <Icon
        className={cx('opacity-40', {
          'ml-4': pointType === 'fiat',
        })}
        name="icon/calendar"
        color="dark"
      />
      <Text
        ref={timeTooltipRef}
        className="opacity-50"
        message=""
        color="dark"
        size="t12m"
      />
    </div>
  )
}


export default React.memo(Time)
