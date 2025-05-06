import type { ChartProps } from '../Chart'


export enum Views {
  Legend = 'legend',
  NoItem = 'no-items',
  Skeleton = 'skeleton',
  NotConnected = 'not-connected',
}

type Input = Pick<ChartProps, 'isNotConnected' | 'isFetching' | 'connect' | 'data'> & {
  chart: Charts.Chart | null
  dataArr: Charts.DataArr
  isShowLegend?: boolean
}

const useView = (values: Input) => {
  const { data, chart, dataArr, isFetching, isNotConnected, isShowLegend, connect } = values

  if (isFetching) {
    return Views.Skeleton
  }

  const isNotConnectedVisible = (
    isNotConnected
    && !isFetching
    && typeof connect === 'function'
  )

  if (isNotConnectedVisible) {
    return Views.NotConnected
  }

  const isEmptyData = data.every(({ data }) => !data.length)

  const isNoItemsVisible = (
    !isFetching
    && isEmptyData
    && !isNotConnectedVisible
  )

  if (isNoItemsVisible) {
    return Views.NoItem
  }

  const isLegendVisible = (
    chart
    && !isFetching
    && isShowLegend
    && dataArr.length
    && data.length > 0
    && !isNoItemsVisible
    && !isNotConnectedVisible
  )

  if (isLegendVisible) {
    return Views.Legend
  }
}


export default useView
