import { useEffect, useMemo } from 'react'
import { useConfig } from 'config'
import forms from 'sw-modules/forms'
import { commonMessages } from 'helpers'

import type { SelectProps, TabsProps } from 'components'

import { Tab, Type } from './enums'
import useChartPoints from './useChartPoints'

import messages from './messages'


export type Form = {
  tab: Tab
  type: Type
  days: string
}

const daysOptions = [
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
]

export const chartTypeOptions: SelectProps['options'] = [
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
]

const initialDays = daysOptions[0].value
const initialType = chartTypeOptions[0].value as Type

const useChartTabs = () => {
  const { sdk } = useConfig()

  const tabsOptions: TabsProps['tabsList'] = useMemo(() => [
    {
      id: Tab.User,
      title: commonMessages.myStats,
      dataTestId: 'stake-user-stats-chart-tab',
    },
    {
      id: Tab.OsToken,
      title: { ...messages.osTokenStats, values: { token: sdk.config.tokens.mintToken } },
      dataTestId: 'osToken-stats-chart-tab',
    },
  ], [ sdk ])

  const form = forms.useForm<Form>({
    type: {
      valueType: 'string',
      initialValue: initialType,
    },
    tab: {
      valueType: 'string',
      initialValue: tabsOptions[1].id as Tab,
    },
    days: {
      valueType: 'string',
      initialValue: initialDays,
    },
  })

  const { values: { type, tab, days } } = forms.useFormValues<Form>(form)

  const { points, isFetching, isExportVisible  } = useChartPoints({
    days: Number(days),
    tab: tab as Tab || Tab.OsToken,
    type: type as Type || Type.Rewards,
  })

  return useMemo(() => ({
    form,
    points,
    isFetching,
    daysOptions,
    tabsOptions,
    isExportVisible,
    chartTypeOptions,
  }), [ form, points, isFetching, tabsOptions, isExportVisible ])
}


export default useChartTabs
