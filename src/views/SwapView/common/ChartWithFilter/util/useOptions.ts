import { useMemo } from 'react'
import { commonMessages } from 'helpers'

import { Tab, Type } from './enums'
import type { Options, TabsItems } from './types'

import messages from './messages'


const useOptions = (tabsItems: TabsItems): Options => {
  const tabs = useMemo<Options['tabs']>(() => {
    const data: Record<Tab, Omit<Options['tabs'][0], 'id'>> = {
      [Tab.Vault]: {
        title: messages.vaultStats,
        dataTestId: 'vault-stats-chart-tab',
      },
      [Tab.User]: {
        title: messages.myStats,
        dataTestId: 'user-stats-chart-tab',
      },
    }

    const options: Options['tabs'] = tabsItems.map(({ tab }) => ({
      id: tab,
      ...data[tab],
    }))

    return options
  }, [ tabsItems ])

  const types = useMemo<Options['types']>(() => [
    {
      value: Type.Rewards,
      title: commonMessages.rewards,
    },
    {
      value: Type.Balance,
      title: commonMessages.balance,
    },
    {
      value: Type.APY,
      title: commonMessages.apy,
    },
  ], [])

  const days = useMemo<Options['days']>(() => [
    {
      title: { ...commonMessages.time.countMonths, values: { month: 1 } },
      value: '30',
    },
    {
      title: { ...commonMessages.time.countMonths, values: { month: 3 } },
      value: '90',
    },
    {
      title: { ...commonMessages.time.countMonths, values: { month: 6 } },
      value: '180',
    },
    {
      title: commonMessages.time.year,
      value: '365',
    },
  ], [])

  return useMemo(() => ({
    types,
    tabs,
    days,
  }), [
    types,
    tabs,
    days,
  ])
}


export default useOptions
