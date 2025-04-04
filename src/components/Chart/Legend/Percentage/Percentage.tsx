import React, { useRef, useCallback } from 'react'
import methods from 'helpers/methods'
import cx from 'classnames'

import Text from '../../../Text/Text'
import { useSubscribe } from '../util'

import s from './Percentage.module.scss'


export type PercentageProps = {
  className?: string
  chart: Charts.Chart
  series: Charts.Series
}

const Percentage: React.FC<PercentageProps> = (props) => {
  const { className, chart, series } = props

  const percentageTooltipRef = useRef<HTMLDivElement>(null)

  const callback = useCallback((point: Charts.Point) => {
    if (percentageTooltipRef.current) {
      percentageTooltipRef.current.innerHTML = methods.formatApy(point.value)
    }
  }, [])

  useSubscribe({ chart, series, callback })

  return (
    <Text
      ref={percentageTooltipRef}
      className={cx(className, s.value, 'opacity-80')}
      color="dark"
      size="t18m"
      message=""
    />
  )
}


export default React.memo(Percentage)
