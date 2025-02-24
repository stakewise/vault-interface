import { useMemo } from 'react'
import intl from 'sw-modules/intl'
import theme, { ThemeColor } from 'sw-modules/theme'

import type { DeepPartial, ChartOptionsBase } from 'lightweight-charts'
import { LineStyle, LineWidth, CrosshairMode } from 'lightweight-charts'


type Input = {
  style: Charts.Style
  hideRightPriceScale?: boolean
  formatLabel: (value: number) => string | number
}

const useSettings = (input: Input) => {
  const { style, hideRightPriceScale, formatLabel } = input

  const { themeValue } = theme.useData()
  const intlControls = intl.useIntl()

  const isLight = themeValue === ThemeColor.Light

  const moonColor = isLight ? '#00060F' : '#FFFFFF'
  const gridColor = isLight ? '#00040e26' : '#FFFFFF12'
  const moonOpacityColor = isLight ? '#00040e0d' : '#FFFFFF12'

  return useMemo<DeepPartial<ChartOptionsBase>>(() => {
    return ({
      autoSize: true,
      localization: {
        locale: intlControls.locale,
        priceFormatter: (value: number) => formatLabel(value),
      },
      handleScale: {
        axisPressedMouseMove: false,
      },
      handleScroll: {
        vertTouchDrag: false,
        horzTouchDrag: false,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: gridColor,
          style: LineStyle.SparseDotted,
        },
      },
      layout: {
        attributionLogo: false,
        textColor: moonColor,
        background: { color: 'transparent' },
      },
      timeScale: {
        timeVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
        ticksVisible: false,
        borderColor: moonOpacityColor,
      },
      rightPriceScale: {
        autoScale: false,
        entireTextOnly: true,
        visible: !hideRightPriceScale,
        borderColor: moonOpacityColor,
        scaleMargins: {
          top: style === 'line' ? 0.25 : 0.2,
          bottom: style === 'line' ? 0.1 : 0,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: false,
          width: 1 as LineWidth,
          style: LineStyle.Solid,
          color: moonOpacityColor,
        },
        mode: CrosshairMode.Magnet,
        vertLine: {
          visible: true,
          labelVisible: false,
          width: 2 as LineWidth,
          style: LineStyle.Solid,
          color: moonOpacityColor,
        },
      },
    })
  }, [ gridColor, moonColor, moonOpacityColor, style, hideRightPriceScale, intlControls.locale, formatLabel ])
}


export default useSettings
