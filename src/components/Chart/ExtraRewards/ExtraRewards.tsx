import React, { useEffect, useRef, RefObject, useMemo } from 'react'
import type { MouseEventParams } from 'lightweight-charts'
import { createSelector, useSelector } from 'store'
import { methods } from 'helpers'
import theme from 'modules/theme'
import date from 'modules/date'
import cx from 'classnames'

import Icon from '../../Icon/Icon'
import Text from '../../Text/Text'
import Logo from '../../Logo/Logo'

import messages from './messages'


type ExtraRewardsProps = {
  className?: string
  token: Tokens
  data: Charts.MainData
  series?: Charts.Series
  chart: Charts.Chart | null
  container: RefObject<HTMLDivElement | null>
}

type RewardsData = {
  message: Intl.Message
  rowRef: React.RefObject<HTMLDivElement | null>
  fiatRef: React.RefObject<HTMLDivElement | null>
  amountRef: React.RefObject<HTMLDivElement | null>
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

const ExtraRewards: React.FC<ExtraRewardsProps> = (props) => {
  const { token, data, chart, series, container, className } = props

  const { isDark } = theme.useData()

  const { fiatRates, currency, currencySymbol } = useSelector(storeSelector)

  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const boostRowRef = useRef<HTMLDivElement | null>(null)
  const boostAmountRef = useRef<HTMLDivElement | null>(null)
  const boostFiatRef = useRef<HTMLDivElement | null>(null)

  const stakeRowRef = useRef<HTMLDivElement | null>(null)
  const stakeAmountRef = useRef<HTMLDivElement | null>(null)
  const stakeFiatRef = useRef<HTMLDivElement | null>(null)

  const totalRowRef = useRef<HTMLDivElement | null>(null)
  const totalAmountRef = useRef<HTMLDivElement | null>(null)
  const totalFiatRef = useRef<HTMLDivElement | null>(null)

  const timeRef = useRef<HTMLDivElement | null>(null)

  const tooltipClassName = cx(
    `
      hidden absolute w-[235px] overflow-hidden rounded-8 shadow-coal
      border border-dark/10 backdrop-blur-[30px] z-modal pointer-events-none
    `,
    {
      'bg-white/70': !isDark,
      'bg-dark/80': isDark,
    },
    className
  )

  useEffect(() => {
    const containerElement = container.current
    const tooltipElement = tooltipRef.current

    if (!containerElement || !chart || !tooltipElement) {
      return
    }

    const formatFiatAmount = (value: number) => {
      const rate = fiatRates[token][currency]
      const result = Number((rate * value).toFixed(2))
      const formattedResult = methods.numericalReduction(Math.abs(result))

      const prefix = result < 0 ? '-' : ''

      const fiatAmount = formattedResult === '0.00'
        ? `< ${prefix}${currencySymbol} 0.01`
        : `${prefix}${currencySymbol}${formattedResult}`

      return `(${fiatAmount})`
    }

    const updateTooltipContent = (extra: Charts.ExtraData) => {
      const rows: Array<{
        amountRef: React.RefObject<HTMLDivElement | null>
        fiatRef: React.RefObject<HTMLDivElement | null>
        rowRef: React.RefObject<HTMLDivElement | null>
        value: number
      }> = []

      if (!extra.stakeRewards && !extra.boostRewards) {
        tooltipRef?.current?.classList.add('hidden!')

        return
      }
      else {
        tooltipRef?.current?.classList.remove('hidden!')
      }

      if (extra.stakeRewards) {
        stakeRowRef.current?.classList.remove('hidden!')
        rows.push({ amountRef: stakeAmountRef, fiatRef: stakeFiatRef, value: extra.stakeRewards, rowRef: stakeRowRef })
      }
      else {
        stakeRowRef.current?.classList.add('hidden!')
      }

      if (extra.boostRewards) {
        boostRowRef.current?.classList.remove('hidden!')
        totalRowRef.current?.classList.remove('hidden!')

        rows.push(
          { amountRef: boostAmountRef, fiatRef: boostFiatRef, value: extra.boostRewards, rowRef: boostRowRef },
          { amountRef: totalAmountRef, fiatRef: totalFiatRef, value: extra.stakeRewards + extra.boostRewards, rowRef: totalRowRef }
        )
      }
      else {
        boostRowRef.current?.classList.add('hidden!')
        totalRowRef.current?.classList.add('hidden!')
      }

      for (const { amountRef, fiatRef, value, rowRef } of rows) {
        if (rowRef.current) {
          rowRef.current.style.display = value ? 'flex' : 'none'
        }

        if (amountRef?.current && value) {
          amountRef.current.innerHTML = methods.formatTokenValue(String(value), true)
        }

        if (fiatRef?.current && value) {
          fiatRef.current.innerHTML = formatFiatAmount(Number(value))
        }
      }

      if (timeRef.current) {
        timeRef.current.innerHTML = date
          .time(Number(extra.time) * 1000)
          .utcOffset(0, false)
          .format('DD MMM YYYY')
      }
    }

    const hideTooltip = () => {
      tooltipElement.style.display = 'none'
    }

    const positionTooltip = (x: number, y: number) => {
      const rect = containerElement.getBoundingClientRect()

      const width = tooltipElement.offsetWidth
      const height = tooltipElement.offsetHeight

      const offset = 12

      let left = x + offset

      if (left > rect.width - width) {
        left = x - offset - width
      }

      let top = y + offset

      if (top > rect.height - height) {
        top = y - offset - height
      }

      tooltipElement.style.top = `${top}px`
      tooltipElement.style.display = 'block'
      tooltipElement.style.left = `${left}px`
    }

    const findExtraDataByTime = (params: MouseEventParams): Charts.ExtraData | null => {
      const { time } = params

      for (const block of data) {
        const currentPoint = block.data.find(pt => pt?.extraData && pt.time === time)

        if (currentPoint?.extraData) {
          return currentPoint.extraData
        }
      }

      return null
    }

    const onCrosshairMove = (params: MouseEventParams) => {
      const pointerPoint = params?.point

      if (!pointerPoint) {
        return hideTooltip()
      }

      const extraData = findExtraDataByTime(params)

      if (!extraData || !series) {
        return hideTooltip()
      }

      const data = series.data()

      const point: Charts.Point = params?.time
        ? params.seriesData.get(series as any)
        : data[data.length - 1]

      updateTooltipContent({ ...extraData, time: point.time })

      tooltipElement.style.display = 'block'
      positionTooltip(pointerPoint.x, pointerPoint.y)
    }

    chart.subscribeCrosshairMove(onCrosshairMove)

    const onMouseLeave = () => hideTooltip()
    containerElement.addEventListener('mouseleave', onMouseLeave)

    return () => {
      chart.unsubscribeCrosshairMove(onCrosshairMove)
      containerElement.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [ data, chart, container, tooltipClassName, fiatRates, token, series, currency, currencySymbol ])

  const rewardsData: RewardsData[] = useMemo(() => {
    return [
      {
        rowRef: boostRowRef,
        fiatRef: boostFiatRef,
        message: messages.boost,
        amountRef: boostAmountRef,
      },
      {
        rowRef: stakeRowRef,
        fiatRef: stakeFiatRef,
        message: messages.stake,
        amountRef: stakeAmountRef,
      },
      {
        rowRef: totalRowRef,
        fiatRef: totalFiatRef,
        message: messages.total,
        amountRef: totalAmountRef,
      },
    ]
  }, [])

  return (
    <div
      ref={tooltipRef}
      className={tooltipClassName}
    >
      <div className="p-8 flex items-center gap-4">
        <Text
          className="w-[50%] font-medium"
          size="sm"
          color="primary"
          message={messages.rewards}
        />
        <div className="w-[50%] flex items-center gap-4 justify-end">
          <Icon
            className="opacity-40"
            name="icon/calendar"
            color="dark"
          />
          <Text
            ref={timeRef}
            className="opacity-50 font-medium"
            message=""
            color="dark"
            size="xs"
          />
        </div>
      </div>
      {
        rewardsData.map(({ message, fiatRef, amountRef, rowRef }, index) => (
          <div
            key={index}
            ref={rowRef}
            className={cx('flex p-8 items-center gap-16 justify-between border-top border-dark/5', {
              '': index,
            })}
          >
            <Text
              size="xs"
              color="dark"
              message={message}
            />
            <div>
              <div className="flex gap-4 items-center justify-end">
                <Logo name={`token/${token}`} size={12} />
                <Text
                  className="font-medium"
                  ref={amountRef}
                  message=""
                  size="xs"
                  color="dark"
                />
                <Text
                  ref={fiatRef}
                  className="ml-4 opacity-50 font-medium text-right"
                  message=""
                  color="dark"
                  size="xs"
                />
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}


export default React.memo(ExtraRewards)
