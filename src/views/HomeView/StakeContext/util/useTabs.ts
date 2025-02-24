import { useMemo, useCallback, useState, useEffect } from 'react'
import { useConfig } from 'config'

import { Tab } from './enum'


export const tabsMock = {
  value: Tab.Stake,
  setTab: (() => {}) as StakePage.Tabs.SetTab,
}

const useTabs = () => {
  const { isChainChanged } = useConfig()
  const [ tab, setTab ] = useState<Tab>(Tab.Stake)

  const handleSetTab = useCallback((tab: Tab) => {
    const isValid = Object.values(Tab).includes(tab)

    if (isValid) {
      setTab(tab)
    }
  }, [])

  useEffect(() => {
    if (isChainChanged) {
      setTab(Tab.Stake)
    }
  }, [ isChainChanged ])

  return useMemo(() => ({
    value: tab,
    setTab: handleSetTab,
  }), [
    tab,
    handleSetTab,
  ])
}


export default useTabs
