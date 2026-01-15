import React from 'react'
import cx from 'classnames'

import Legend from './Legend/Legend'
import NoItems from './NoItems/NoItems'
import Skeleton from './Skeleton/Skeleton'
import NotConnected from './NotConnected/NotConnected'

import { useChart, Views } from './util'


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
  const { className, token, height, pointType, dataTestId, legendClassName, noItemsDescription, connect } = props

  const {
    view,
    chart,
    dataArr,
    containerRef,
    showLegend,
    hideLegend,
  } = useChart(props)

  return (
    <div
      ref={containerRef}
      className={cx(className, 'relative w-full')}
      style={{ minHeight: `${height || 340}px` }}
      data-testid={dataTestId}
      onMouseOver={showLegend}
      onMouseLeave={hideLegend}
      onTouchStart={showLegend}
      onTouchEnd={hideLegend}
    >
      {
        view === Views.Skeleton && (
          <Skeleton />
        )
      }
      {
        view === Views.NoItem && (
          <NoItems description={noItemsDescription} />
        )
      }
      {
        view === Views.NotConnected && (
          <NotConnected onClick={connect} />
        )
      }
      {
        view === Views.Legend && (
          <div className="absolute top-6 left-6 z-10">
            <Legend
              className={legendClassName}
              chart={chart as Charts.Chart}
              pointType={pointType}
              dataArr={dataArr}
              token={token}
            />
          </div>
        )
      }
    </div>
  )
}


export default React.memo(Chart)
