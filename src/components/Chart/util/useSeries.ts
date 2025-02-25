import { useCallback, useMemo } from 'react'
import theme, { ThemeColor } from 'sw-modules/theme'
import { LineStyle } from 'lightweight-charts'
import type { AreaSeriesPartialOptions, HistogramSeriesPartialOptions, CreatePriceLineOptions, LineWidth } from 'lightweight-charts'


type Input = {
  style: Charts.Style
}

type Output = {
  defaultSeries: AreaSeriesPartialOptions
  getPriceLineSeries: (price: number) => CreatePriceLineOptions
}

const getDefaultSeriesOptions = (themeValue: ThemeColor): AreaSeriesPartialOptions => ({
  lineWidth: 2,
  topColor: themeValue === ThemeColor.Light ? '#d6e6ff24' : '#232123ba',
  lineColor: themeValue === ThemeColor.Light ? '#3559e4' : '#627eea',
  bottomColor: themeValue === ThemeColor.Light ? '#74aafc91' : '#74aafc78',
  lastValueVisible: false,
  priceLineVisible: false,
})

const getHistogramSeriesOptions = (themeValue: ThemeColor): HistogramSeriesPartialOptions => ({
  color: themeValue === ThemeColor.Light ? '#74a2fc99' : '#617ee9e0',
  priceLineVisible: false,
  lastValueVisible: false,
  priceFormat: {
    precision: 5,
    type: 'price',
    minMove: 0.00001,
  },
})

const useSeries = (input: Input): Output => {
  const { style } = input

  const { themeValue } = theme.useData()

  const isLight = themeValue === ThemeColor.Light

  const getPriceLineSeries = useCallback((price: number) => ({
    price,
    axisLabelVisible: true,
    lineWidth: 1 as LineWidth,
    lineStyle: LineStyle.LargeDashed,
    color: isLight ? '#6b6b94' : '#787887',
  }), [ isLight ])

  return useMemo(() => ({
    defaultSeries: style === 'line'
      ? getDefaultSeriesOptions(themeValue)
      : getHistogramSeriesOptions(themeValue),
    getPriceLineSeries,
  }), [ style, themeValue, getPriceLineSeries ])
}


export default useSeries
