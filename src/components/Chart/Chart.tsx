import React, { useRef } from 'react'
import cx from 'classnames'

import Legend from './Legend/Legend'
import NoItems from './NoItems/NoItems'
import Skeleton from './Skeleton/Skeleton'
import NotConnected from './NotConnected/NotConnected'

import { useCreateChart, usePriceLine, useShowLegend } from './util'


export type ChartProps = {
  className?: string
  token: Tokens
  height?: number
  style: Charts.Style
  isFetching: boolean
  dataTestId?: string
  data: Charts.MainData
  legendClassName?: string
  isNotConnected?: boolean
  hideRightScale?: boolean
  showLegendOnHover?: boolean
  pointType: Charts.PointType
  noItemsDescription?: Intl.Message
  expandSettings?: Charts.ExpandSettings
  connect?: () => void
}

const Chart: React.FC<ChartProps> = (props) => {
  const {
    className,
    data,
    token,
    style,
    height,
    pointType,
    dataTestId,
    isFetching,
    isNotConnected,
    hideRightScale,
    legendClassName,
    showLegendOnHover,
    noItemsDescription,
    expandSettings,
    connect,
  } = props

  const chartContainerRef = useRef<HTMLDivElement>(null)

  const { isShowLegend, showLegend, hideLegend } = useShowLegend({
    skip: !showLegendOnHover,
  })

  const { chart, dataArr } = useCreateChart({
    skip: isFetching || !data.length,
    container: chartContainerRef,
    hideRightScale,
    expandSettings,
    pointType,
    style,
    data,
  })

  usePriceLine({
    container: chartContainerRef,
    dataArr,
  })

  const isNotConnectedVisible = isNotConnected && !isFetching && typeof connect === 'function'
  const isLegendVisible = !isFetching && data.length > 0 && chart && dataArr.length && isShowLegend
  const isNoItemsVisible = !isFetching && !data.length && !isNotConnectedVisible

  return (
    <div
      ref={chartContainerRef}
      className={cx(className, 'relative w-full')}
      style={{ minHeight: `${height || 340}rem` }}
      data-testid={dataTestId}
      onMouseOver={showLegend}
      onMouseLeave={hideLegend}
      onTouchStart={showLegend}
      onTouchEnd={hideLegend}
    >
      {
        isFetching && (
          <Skeleton />
        )
      }
      {
        isNoItemsVisible && (
          <NoItems description={noItemsDescription} />
        )
      }
      {
        isNotConnectedVisible && (
          <NotConnected onClick={connect} />
        )
      }
      {
        isLegendVisible && (
          <div className="absolute top-6 left-6 z-10">
            <Legend
              className={legendClassName}
              pointType={pointType}
              dataArr={dataArr}
              chart={chart}
              token={token}
            />
          </div>
        )
      }
    </div>
  )
}


export default React.memo(Chart)
