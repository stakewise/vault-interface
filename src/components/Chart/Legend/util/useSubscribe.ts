import { useEffect, useCallback, useRef } from 'react'
import type { MouseEventParams, Time, SingleValueData } from 'lightweight-charts'
import equal from 'fast-deep-equal'


type Input = {
  chart: Charts.Chart
  series: Charts.Series
  callback: (point: Charts.Point) => void
}

const useSubscribe = (values: Input) => {
  const { chart, series, callback } = values

  const savedPointRef = useRef<Charts.Point | null>(null)

  const handler = useCallback((param: MouseEventParams<Time> | null) => {
    const data = series.data()

    const currentPoint = param?.time
      ? param.seriesData.get(series as any)
      : data[data.length - 1]

    if (!currentPoint || equal(savedPointRef.current, currentPoint)) {
      return
    }

    savedPointRef.current = currentPoint as Charts.Point

    const point = currentPoint as SingleValueData | Charts.Point

    if (typeof callback === 'function') {
      callback(point)
    }
  }, [ series, callback ])

  useEffect(() => {
    if (!chart) {
      return
    }

    chart.subscribeCrosshairMove(handler)

    handler(null)

    return () => {
      chart.unsubscribeCrosshairMove(handler)
    }
  }, [ chart, handler ])
}


export default useSubscribe
