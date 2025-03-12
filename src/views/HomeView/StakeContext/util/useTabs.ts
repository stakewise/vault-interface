import { useMemo, useCallback, useState } from 'react'
import { useChainChanged } from 'hooks'

import { Tab } from './enum'


export const tabsMock = {
  value: Tab.Stake,
  setTab: (() => {}) as StakePage.Tabs.SetTab,
}

const useTabs = () => {
  const [ tab, setTab ] = useState<Tab>(Tab.Stake)

  const handleSetTab = useCallback((tab: Tab) => {
    const isValid = Object.values(Tab).includes(tab)

    if (isValid) {
      setTab(tab)
    }
  }, [])

  useChainChanged(() => setTab(Tab.Stake))

  return useMemo(() => ({
    value: tab,
    setTab: handleSetTab,
  }), [
    tab,
    handleSetTab,
  ])
}


export default useTabs
