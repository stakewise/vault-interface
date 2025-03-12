import { useConfig } from 'config'
import { useStore } from 'hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import getTabIds from './getTabIds'
import getTabsList from './getTabsList'


const storeSelector = (store: Store) => ({
  isMoreV2: store.vault.base.data.versions.isMoreV2,
  isMintTokenDisabled: store.vault.user.balances.mintToken.isDisabled,
})

const useTabs = () => {
  const { isEthereum } = useConfig()
  const { tabs } = stakeCtx.useData()
  const { isMoreV2, isMintTokenDisabled } = useStore(storeSelector)

  const withMint = !isMintTokenDisabled
  const withBoost = withMint && isEthereum && isMoreV2
  const withToggleButton = withMint || withBoost

  const isInitiallyReversed = getTabIds({ withMint, withBoost }).indexOf(tabs.value) === -1

  const [ isReversed, setReversed ] = useState(isInitiallyReversed)

  const [ tabIds, tabsList ] = useMemo(() => [
    getTabIds({ withMint, withBoost, isReversed }),
    getTabsList({ withMint, withBoost, isReversed }),
  ], [ withMint, withBoost, isReversed ])

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
      const nextTabIndex = withToggleButton ? tabIndex : 0

      tabs.setTab(tabIds[nextTabIndex])
    }

    if (!withToggleButton) {
      setReversed(false)
    }
  }, [ tabs, tabIds, tabIndex, withToggleButton ])

  const toggleReversed = useCallback(() => {
    setReversed((isReversed) => !isReversed)
  }, [])

  return useMemo(() => ({
    tabIndex,
    tabsList,
    withToggleButton,
    toggleReversed,
  }), [
    tabIndex,
    tabsList,
    withToggleButton,
    toggleReversed,
  ])
}


export default useTabs
