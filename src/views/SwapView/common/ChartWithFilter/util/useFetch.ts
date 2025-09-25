import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useObjectState, useAddressChanged, useChainChanged } from 'hooks'
import notifications from 'modules/notifications'
import { commonMessages } from 'helpers'

import { Type, Tab } from './enums'
import { CacheData, Form, TabsItems } from './types'


type Input = {
  tab: Tab
  type: Type
  days: number
  tabsItems: TabsItems
  form: Forms.Form<Form>
}

type Output = {
  data: Charts.MainData
  isFetching: boolean
}

type State = {
  data: CacheData
  isFetching: boolean
}

type Cache = Record<Tab, Record<number, State['data']>>

const initialData = {
  apy: [],
  balance: [],
  rewards: [],
}

const useFetch = (input: Input): Output => {
  const { days, type, tab, form, tabsItems } = input

  const isInitRef = useRef(false)

  const cacheRef = useRef<Cache>({
    [Tab.Vault]: {},
    [Tab.User]: {},
  })

  const [ state, setState ] = useObjectState<State>({
    data: initialData,
    isFetching: true,
  })

  const fetchData = useCallback(async () => {
    if (cacheRef.current[tab][days]) {
      setState({
        // ATTN we need a new object because we'll mutate it and this will break the chart
        data: Object.assign(cacheRef.current[tab][days], {}),
        isFetching: false,
      })

      return
    }

    setState({ isFetching: true })

    try {
      const selectedItem = tabsItems.find((item) => item.tab === tab) as TabsItems[0]

      const data: CacheData | null = await selectedItem.fetcher(days)

      if (!data) {
        setState({
          data: initialData,
          isFetching: false,
        })

        return
      }

      cacheRef.current[tab][days] = data

      const isEmptyUserData = (
        tab === Tab.User
        && !data.apy.length
        && !isInitRef.current
        && !data.balance.length
        && !data.rewards.length
      )

      if (isEmptyUserData) {
        const otherItem = tabsItems.find((item) => item.tab != tab) as TabsItems[0]
        form.fields.tab.setValue(otherItem.tab)

        return
      }

      isInitRef.current = true

      setState({
        data,
        isFetching: false,
      })
    }
    catch (error) {
      console.error('Cant fetch chart data in tab:', error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })

      setState({ isFetching: false })
    }
  }, [ tab, days, form, tabsItems, setState ])

  const resetCache = useCallback(() => {
    cacheRef.current = {
      ...cacheRef.current,
      [Tab.User]: {},
    }

    fetchData()
  }, [ fetchData ])

  useChainChanged(resetCache)
  useAddressChanged(resetCache)

  useEffect(() => {
    fetchData()
  }, [ fetchData ])

  return useMemo(() => {
    let data = state.data.rewards

    if (type === Type.APY) {
      data = state.data.apy
    }

    if (type === Type.Balance) {
      data = state.data.balance
    }

    return {
      data: [ { data } ],
      isFetching: state.isFetching,
    }
  }, [ type, state ])
}


export default useFetch
