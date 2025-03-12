import type { Time, ISeriesApi, IChartApi, AreaSeriesPartialOptions, DeepPartial, ChartOptionsBase } from 'lightweight-charts'


declare global {
  declare namespace Charts {
    type Chart = IChartApi

    type Settings = DeepPartial<ChartOptionsBase>

    type ExpandSettings = (settings: Settings) => Settings

    type Options = AreaSeriesPartialOptions & {
      legendTitle?: string | Intl.Message
      priceLineColor?: string
      hidePriceLines?: boolean
      legendLine?: string
    }

    type TimePoint = {
      time: Time
      value: number
    }

    type Point = {
      time: Time | number
      value: number
    }

    type Style = 'bar' | 'line'

    type PointType = 'fiat' | 'percent'

    type Series = ISeriesApi<'Area', Time, Charts.Point> | ISeriesApi<'Histogram', Time, Charts.Point>

    type MainData = Array<{
      data: Point[]
      options?: Options
    }>

    type DataArr = Array<{
      series: Charts.Series
      options?: Charts.Options
    }>
  }
}
