import { useCallback, useRef, useEffect } from 'react'
import type { LineWidth } from 'lightweight-charts'
import theme, { ThemeColor } from 'modules/theme'
import { LineStyle, IPriceLine } from 'lightweight-charts'


type Input = {
  dataArr: Charts.DataArr
  container: React.RefObject<HTMLDivElement>
}

type SavedParams = {
  max: IPriceLine | null
  min: IPriceLine | null
}

const usePriceLine = (values: Input) => {
  const { container, dataArr } = values

  const { themeValue } = theme.useData()

  const savedMethods = useRef(new Map<Charts.Series, SavedParams>())

  const isLight = themeValue === ThemeColor.Light

  const getPriceLineOptions = useCallback((price: number, options?: Charts.Options) => ({
    price,
    axisLabelVisible: true,
    lineWidth: 1 as LineWidth,
    lineStyle: LineStyle.LargeDashed,
    color: options?.priceLineColor || (isLight ? '#6b6b94' : '#787887'),
  }), [ isLight ])

  const removePriceLines = useCallback(() => {
    dataArr.forEach(({ series }) => {
      const { max, min } = savedMethods.current.get(series) || {}

      if (max) {
        series.removePriceLine(max)
      }

      if (min) {
        series.removePriceLine(min)
      }

      savedMethods.current.set(series, { min: null, max: null })
    })
  }, [ dataArr ])

  const createPriceLines = useCallback(() => {
    let maxValue = 0,
        minValue = 0

    dataArr.forEach(({ series, options }) => {
      if (options?.hidePriceLines) {
        return
      }

      const data = series.data()
      const pointValues = data.map(({ value }) => value || 0)

      const priceMin = Math.min(...pointValues)
      const priceMax = Math.max(...pointValues)

      const params: SavedParams = {
        max: null,
        min: null,
      }

      if (maxValue !== priceMax) {
        params.max = series.createPriceLine(getPriceLineOptions(priceMax, options))
      }

      if (minValue !== priceMin && priceMin !== priceMax) {
        params.min = series.createPriceLine(getPriceLineOptions(priceMin, options))
      }

      savedMethods.current.set(series, params)

      maxValue = maxValue < priceMax ? priceMax : maxValue
      minValue = minValue > priceMax ? priceMax : minValue
    })
  }, [ dataArr, getPriceLineOptions ])

  useEffect(() => {
    let box: React.RefObject<HTMLDivElement>['current']

    if (dataArr.length && container.current) {
      box = container.current

      container.current?.addEventListener('mouseover', createPriceLines)
      container.current?.addEventListener('mouseout', removePriceLines)
    }

    return () => {
      box?.removeEventListener('mouseover', createPriceLines)
      box?.removeEventListener('mouseout', removePriceLines)
    }
  }, [ dataArr, container, createPriceLines, removePriceLines ])
}


export default usePriceLine
