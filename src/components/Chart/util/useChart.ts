import { useRef, useMemo } from 'react'

import useView from './useView'
import { ChartProps } from '../Chart'
import usePriceLine from './usePriceLine'
import useShowLegend from './useShowLegend'
import useCreateChart from './useCreateChart'


type Input = Pick<ChartProps, 'data'
| 'style'
| 'pointType'
| 'isFetching'
| 'isNotConnected'
| 'hideRightScale'
| 'showLegendOnHover'
| 'expandSettings'
| 'connect'
>

const useChart = (values: Input) => {
  const {
    data,
    style,
    pointType,
    isFetching,
    isNotConnected,
    hideRightScale,
    showLegendOnHover,
    expandSettings,
    connect,
  } = values

  const containerRef = useRef<HTMLDivElement>(null)

  const { isShowLegend, showLegend, hideLegend } = useShowLegend({
    skip: !showLegendOnHover,
  })

  const { chart, dataArr } = useCreateChart({
    skip: isFetching || !data.length,
    container: containerRef,
    hideRightScale,
    expandSettings,
    pointType,
    style,
    data,
  })

  usePriceLine({
    container: containerRef,
    dataArr,
  })

  const view = useView({
    data,
    chart,
    dataArr,
    isFetching,
    isShowLegend,
    isNotConnected,
    connect,
  })

  return useMemo(() => ({
    view,
    chart,
    dataArr,
    hideLegend,
    showLegend,
    containerRef,
  }), [
    view,
    chart,
    dataArr,
    hideLegend,
    showLegend,
    containerRef,
  ])
}


export default useChart
