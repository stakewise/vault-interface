import React, { useEffect, useRef } from 'react'
import cx from 'classnames'
import methods from 'sw-methods'
import date from 'sw-modules/date'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { createChart } from 'lightweight-charts'
import type { MouseEventParams, Time, IPriceLine, SingleValueData } from 'lightweight-charts'

import Legend from './Legend/Legend'
import NoItems from './NoItems/NoItems'
import Skeleton from './Skeleton/Skeleton'

import { useChart } from './util'


export type ChartProps = {
  className?: string
  token: Tokens
  style: Charts.Style
  dataTestId?: string
  data: Charts.Point[]
  isFetching: boolean
  pointType: Charts.PointType
  noItemsDescription?: Intl.Message
  hideRightPriceScale?: boolean
}

const storeSelector = createSelector([
  (store: Store) => store.fiatRates.data,
  (store: Store) => store.currency.selected,
  (store: Store) => store.currency.symbol,
], (fiatRates, currency, currencySymbol) => ({
  currencySymbol,
  fiatRates,
  currency,
}))

const Chart: React.FC<ChartProps> = (props) => {
  const {
    className,
    data,
    style,
    token,
    pointType,
    dataTestId,
    isFetching,
    noItemsDescription,
    hideRightPriceScale,
  } = props

  const { fiatRates, currency, currencySymbol } = useSelector(storeSelector)
  const { settings, defaultSeries, getPriceLineSeries } = useChart({ style, pointType, hideRightPriceScale })

  const chartContainerRef = useRef<HTMLDivElement>(null)

  // Chart price lines refs
  const minPriceLineRef = useRef<IPriceLine | null>(null)
  const maxPriceLineRef = useRef<IPriceLine | null>(null)

  // Refs for Legend
  const fiatTooltipRef = useRef<HTMLDivElement>(null)
  const timeTooltipRef = useRef<HTMLDivElement>(null)
  const percentageTooltipRef = useRef<HTMLDivElement>(null)
  const tokenValueTooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFetching || !data.length) {
      return
    }

    const chart = createChart(chartContainerRef.current as HTMLElement, settings)

    const series = style === 'line'
      ? chart.addAreaSeries(defaultSeries)
      : chart.addHistogramSeries(defaultSeries)

    series.setData(data as Charts.TimePoint[])

    const addMinMaxPriceLines = (priceMin: number, priceMax: number) => {
      minPriceLineRef.current = priceMin === priceMax ? null : series.createPriceLine(getPriceLineSeries(priceMin))
      maxPriceLineRef.current = series.createPriceLine(getPriceLineSeries(priceMax))
    }

    const removeMinMaxPriceLines = () => {
      if (minPriceLineRef.current) {
        series.removePriceLine(minPriceLineRef.current)
        minPriceLineRef.current = null
      }
      if (maxPriceLineRef.current) {
        series.removePriceLine(maxPriceLineRef.current)
        maxPriceLineRef.current = null
      }
    }

    const updateTooltip = (param: MouseEventParams<Time> | null) => {
      const currentPoint = param ? param.seriesData.get(series) : data[data.length - 1]

      if (!currentPoint) {
        return
      }

      const { time, value } = currentPoint as SingleValueData | Charts.Point

      if (timeTooltipRef.current) {
        timeTooltipRef.current.innerHTML = date
          .time(Number(time) * 1000)
          .format('DD MMM YYYY')
      }

      if (percentageTooltipRef.current) {
        percentageTooltipRef.current.innerHTML = methods.formatApy(value)
      }

      if (tokenValueTooltipRef.current) {
        tokenValueTooltipRef.current.innerHTML = methods.formatTokenValue(String(value), true)
      }

      if (fiatTooltipRef.current) {
        const rate = fiatRates[token][currency]
        const result = Number((rate * Number(value)).toFixed(2))
        const perfix = result < 0 ? '-' : ''
        const formattedResult = methods.numericalReduction(Math.abs(result))

        const fiatAmount = formattedResult === '0.00'
          ? `< ${perfix}${currencySymbol} 0.01`
          : `${perfix}${currencySymbol}${formattedResult}`

        fiatTooltipRef.current.innerHTML = `(${fiatAmount})`
      }
    }

    const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
      if (!param || !param.point || !data.length) {
        removeMinMaxPriceLines()
        updateTooltip(null)
        return
      }

      const pointValues = data.map(item => item.value || 0)

      const pointValueMin = Math.min(...pointValues)
      const pointValueMax = Math.max(...pointValues)

      updateTooltip(param)
      removeMinMaxPriceLines()
      addMinMaxPriceLines(pointValueMin, pointValueMax)
    }

    chart.subscribeCrosshairMove(crosshairMoveHandler)

    updateTooltip(null)

    chart.timeScale().fitContent()

    return () => {
      chart.unsubscribeCrosshairMove(crosshairMoveHandler)

      chart.remove()
    }
  }, [
    data,
    style,
    token,
    settings,
    currency,
    fiatRates,
    isFetching,
    defaultSeries,
    currencySymbol,
    getPriceLineSeries,
  ])

  return (
    <div
      ref={chartContainerRef}
      className={cx(className, 'relative min-h-[340rem] w-full')}
      data-testid={dataTestId}
    >
      {
        isFetching && (
          <Skeleton />
        )
      }
      {
        !isFetching && !data.length && (
          <NoItems description={noItemsDescription} />
        )
      }
      {
        !isFetching && data.length > 0 && (
          <Legend
            fiatTooltipRef={fiatTooltipRef}
            timeTooltipRef={timeTooltipRef}
            percentageTooltipRef={percentageTooltipRef}
            tokenValueTooltipRef={tokenValueTooltipRef}
            pointType={pointType}
            token={token}
          />
        )
      }
    </div>
  )
}


export default React.memo(Chart)
