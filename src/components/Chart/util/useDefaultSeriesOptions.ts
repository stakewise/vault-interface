import { useMemo } from 'react'
import theme, { ThemeColor } from 'sw-modules/theme'
import type { AreaSeriesPartialOptions, HistogramSeriesPartialOptions } from 'lightweight-charts'


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

const useDefaultSeriesOptions = (style: Charts.Style): AreaSeriesPartialOptions => {
  const { themeValue } = theme.useData()

  return useMemo(() => style === 'line'
    ? getDefaultSeriesOptions(themeValue)
    : getHistogramSeriesOptions(themeValue)
  , [ style, themeValue ])
}


export default useDefaultSeriesOptions
