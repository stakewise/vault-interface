import { useConfig } from 'config'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import getTabIds from './getTabIds'
import getTabsList from './getTabsList'


const useTabs = () => {
  const { isEthereum } = useConfig()
  const { tabs } = stakeCtx.useData()

  const isInitiallyReversed = getTabIds({ isEthereum }).indexOf(tabs.value) === -1

  const [ isReversed, setReversed ] = useState(isInitiallyReversed)

  const [ tabIds, tabsList ] = useMemo(() => [
    getTabIds({ isEthereum, isReversed }),
    getTabsList({ isEthereum, isReversed }),
  ], [ isEthereum, isReversed ])

  const prevIndex = useRef(tabIds.indexOf(tabs.value))

  const tabIndex = useMemo(() => {
    const activeIndex = tabIds.indexOf(tabs.value)

    if (activeIndex === -1) {
      return prevIndex.current
    }

    prevIndex.current = activeIndex

    return activeIndex
  }, [ tabs, tabIds ])

  useEffect(() => {
    const nextTabIndex = tabIds.indexOf(tabs.value)
    const isResetNeeded = nextTabIndex === -1

    if (isResetNeeded) {
      const nextTabIndex = isEthereum ? tabIndex : 0

      tabs.setTab(tabIds[nextTabIndex])
    }

    if (!isEthereum) {
      setReversed(false)
    }
  }, [ tabs, tabIds, tabIndex, isEthereum ])

  const toggleReversed = useCallback(() => {
    setReversed((isReversed) => !isReversed)
  }, [])

  return useMemo(() => ({
    tabIndex,
    tabsList,
    toggleReversed,
  }), [
    tabIndex,
    tabsList,
    toggleReversed,
  ])
}


export default useTabs
