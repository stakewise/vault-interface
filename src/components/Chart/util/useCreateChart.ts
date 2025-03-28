import { useCallback, useEffect } from 'react'
import { createChart } from 'lightweight-charts'
import { useObjectState } from 'sw-hooks'

import useDefaultSettings from './useDefaultSettings'
import useDefaultSeriesOptions from './useDefaultSeriesOptions'


type Input = {
  skip: boolean
  style: Charts.Style
  data: Charts.MainData
  hideRightScale?: boolean
  pointType: Charts.PointType
  container: React.RefObject<HTMLDivElement>
  expandSettings?: Charts.ExpandSettings
}

type State = {
  chart: Charts.Chart | null
  dataArr: Charts.DataArr
}

const useCreateChart = (input: Input): State => {
  const { container, data, style, pointType, skip, hideRightScale, expandSettings } = input

  const defaultSeries = useDefaultSeriesOptions(style)
  const defaultSettings = useDefaultSettings({ style, pointType, hideRightScale })

  const [ state, setState ] = useObjectState<State>({
    dataArr: [],
    chart: null,
  })

  const isDataEmpty = !data.length || !data.find(({ data }) => data.length)

  const initializeChart = useCallback(() => {
    const params = typeof expandSettings === 'function'
      ? {
          ...defaultSettings,
          ...expandSettings(defaultSettings),
        }
      : defaultSettings

    const chart = createChart(container.current as HTMLElement, params)

    if (data.length > 1 && style === 'bar') {
      throw new Error("The chart cannot have more than one data set to work with a column view")
    }

    const dataArr = data.map(({ data, options }) => {
      const params = {
        ...defaultSeries,
        ...options,
      }

      const series = style === 'line'
        ? chart.addAreaSeries(params)
        : chart.addHistogramSeries(params)

      series.setData(data as Charts.TimePoint[])

      return {
        series: series as Charts.Series,
        options,
      }
    })

    setState({ chart, dataArr })

    return chart
  }, [ data, style, container, defaultSettings, defaultSeries, expandSettings, setState ])

  useEffect(() => {
    if (skip || isDataEmpty) {
      return
    }

    const chart = initializeChart()

    chart.timeScale().fitContent()

    return () => {
      chart.remove()
    }
  }, [
    skip,
    isDataEmpty,
    initializeChart,
  ])

  return state
}


export default useCreateChart
