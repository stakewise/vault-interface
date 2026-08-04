import type {
  Time,
  IChartApi,
  ISeriesApi,
  DeepPartial,
  ChartOptionsBase,
  AreaSeriesPartialOptions,
} from 'lightweight-charts'


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

    type ExtraData = {
      boostRewards: number
      stakeRewards: number
      time?: number | Time
    }

    type TimePoint = {
      time: Time
      value: number
      extraData?: ExtraData
    }

    type Point = {
      extraData?: ExtraData
      time: Time | number
      value: number
    }

    type CacheData = {
      apy: Point[]
      balance: Point[]
      rewards: Point[]
    }

    type Style = 'bar' | 'line'

    type PointType = 'fiat' | 'percent'

    type Series = ISeriesApi<SeriesType, Time>

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
