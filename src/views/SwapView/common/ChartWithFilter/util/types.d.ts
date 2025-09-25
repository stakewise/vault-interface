import type { TabsProps, SelectProps } from 'components'

import { Tab, Type } from './enums'


type SelectOptions<T> = Array<Pick<SelectProps['options'][0], 'title'> & {
  value: T
}>

type TabOptions<T> = Array<Omit<TabsProps['tabsList'][0], 'id'> & {
  id: T
}>

export type Options = {
  types: SelectOptions<Type>
  tabs: TabOptions<Tab>
  days: SelectProps['options']
}

export type Form = {
  tab: Tab
  type: Type
  days: string
}

export type CacheData = {
  apy: Charts.Point[]
  balance: Charts.Point[]
  rewards: Charts.Point[]
}

export type TabsItems = Array<{
  tab: Tab
  fetcher: (days: number) => Promise<CacheData | null>
}>
