import { useMemo, useCallback } from 'react'
import theme, { ThemeColor } from 'modules/theme'
import intl from 'modules/intl'
import methods from 'sw-methods'

import { LineStyle, LineWidth, CrosshairMode } from 'lightweight-charts'


type Input = {
  style: Charts.Style
  hideRightScale?: boolean
  pointType: Charts.PointType
}

const useDefaultSettings = (input: Input) => {
  const { style, pointType, hideRightScale } = input

  const { themeValue } = theme.useData()
  const intlControls = intl.useIntl()

  const isLight = themeValue === ThemeColor.Light

  const darkColor = isLight ? '#00060F' : '#FFFFFF'
  const gridColor = isLight ? '#00040e26' : '#FFFFFF12'
  const darkOpacityColor = isLight ? '#00040e0d' : '#FFFFFF12'

  const formatLabel = useCallback((value: number) => {
    if (pointType === 'percent') {
      return methods.formatApy(value)
    }

    if (value) {
      return methods.formatTokenValue(String(value))
    }

    return '0'
  }, [ pointType ])

  return useMemo<Charts.Settings>(() => {
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
        textColor: darkColor,
        background: { color: 'transparent' },
      },
      timeScale: {
        timeVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
        ticksVisible: false,
        borderColor: darkOpacityColor,
      },
      rightPriceScale: {
        autoScale: false,
        entireTextOnly: true,
        visible: !hideRightScale,
        borderColor: darkOpacityColor,
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
          color: darkOpacityColor,
        },
        mode: CrosshairMode.Magnet,
        vertLine: {
          visible: true,
          labelVisible: false,
          width: 2 as LineWidth,
          style: LineStyle.Solid,
          color: darkOpacityColor,
        },
      },
    })
  }, [
    style,
    gridColor,
    darkColor,
    hideRightScale,
    darkOpacityColor,
    intlControls.locale,
    formatLabel,
  ])
}


export default useDefaultSettings
