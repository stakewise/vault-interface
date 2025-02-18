import { walletNames, tokens } from './constants'


declare global {
  type Tokens = Exclude<typeof tokens[keyof typeof tokens], 'osToken'>
  type WalletIds = keyof typeof walletNames

  type FiatRates = {
    usdEthRate: number
    usdEurRate: number
    usdGbpRate: number
    usdSwiseRate: number
    ethGnoRate: number
    ethXdaiRate: number
  }

  declare namespace Links {

    type Link = {
      path: string
      title?: Intl.Message
      domain?: string
    }

    type Links = {
      root?: Link
      [name: string]: Link | Links
    }

    type AbsoluteLinks<T> = {
      [K in keyof T]: T[K] extends Link ? string : (T[K] extends object ? AbsoluteLinks<T[K]> : never)
    }

    type RouteMeta = Record<string, Intl.Message>
  }
}
