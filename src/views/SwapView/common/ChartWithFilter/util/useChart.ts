import { useMemo } from 'react'
import { useConfig } from 'config'

import useForm from './useForm'
import useFetch from './useFetch'
import { Tab, Type } from './enums'
import useOptions from './useOptions'
import type { TabsItems } from './types'


const useChart = (tabsItems: TabsItems) => {
  const { address } = useConfig()

  const options = useOptions(tabsItems)
  const { form, values } = useForm(options)

  const { data, isFetching } = useFetch({
    days: Number(values.days),
    type: values.type as Type,
    tab: values.tab as Tab,
    tabsItems,
    form,
  })

  const isExportButtonShown = Boolean(
    address
    && data.length
    && data[0].data.length
    && values.tab === 'user'
    && values.type === 'rewards'
  )

  return useMemo(() => ({
    data,
    form,
    values,
    options,
    isFetching,
    isExportButtonShown,
  }), [
    data,
    form,
    values,
    options,
    isFetching,
    isExportButtonShown,
  ])
}


export default useChart
