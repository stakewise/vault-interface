import { useCallback, useMemo } from 'react'
import methods from 'helpers/methods'

import useSeries from './useSeries'
import useSettings from './useSettings'


type Input = {
  style: Charts.Style
  pointType: Charts.PointType
  hideRightPriceScale?: boolean
}

const useChart = (input: Input) => {
  const { style, pointType, hideRightPriceScale } = input

  const formatLabel = useCallback((value: number) => {
    if (pointType === 'percent') {
      return methods.formatApy(value)
    }

    if (value) {
      return methods.formatTokenValue(String(value))
    }

    return '0'
  }, [ pointType ])

  const settings = useSettings({ formatLabel, style, hideRightPriceScale })
  const { defaultSeries, getPriceLineSeries } = useSeries({ style })

  return useMemo(() => ({
    settings,
    defaultSeries,
    getPriceLineSeries,
  }), [ settings, defaultSeries, getPriceLineSeries ])
}


export default useChart
