import { useCallback, useMemo } from 'react'
import { Network } from 'sdk'
import { useConfig } from 'config'
import { useStore, useObjectState, useChainChanged } from 'hooks'

import getTabsList from './getTabsList'

import { Tab } from './enum'


type State = {
  tab: Tab
  isReversed: boolean
}

export const tabsMock: SwapView.Tabs.Data = {
  list: [],
  value: Tab.Stake,
  setTab: (() => {}) as SwapView.Tabs.SetTab,
  toggleTabs: () => {},
}

const storeSelector = (store: Store) => ({
  version: store.vault.base.data.versions.version,
  isMintTokenDisabled: store.vault.user.balances.mintToken.isDisabled,
})

const useTabs = (resetFields: () => void) => {
  const { isEthereum } = useConfig()

  const { isMintTokenDisabled, version } = useStore(storeSelector)

  const withMint = !isMintTokenDisabled
  const isMoreV2 = version >= 2
  const withBoost = withMint && isEthereum && isMoreV2
  const withToggleButton = withMint || withBoost

  const [ { tab, isReversed }, setState ] = useObjectState<State>({
    tab: Tab.Stake,
    isReversed: false,
  })

  const list = useMemo(() => getTabsList({ withMint, withBoost, isReversed }),
    [ withMint, withBoost, isReversed ]
  )

  const setTab = useCallback((tab: Tab) => {
    const isValid = Object.values(Tab).includes(tab)

    if (!isValid) {
      return
    }

    setState((state) => {
      const isExists = list.some(({ id }) => id === tab)

      if (!isExists) {
        console.error(`Invalid tab "${tab}", on list:`, list)

        return state
      }

      resetFields()

      return {
        ...state,
        tab,
      }
    })
  }, [ setState, resetFields, list ])

  const toggleTabs = useCallback(() => {
    setState((state) => {
      if (!withToggleButton) {
        const list = getTabsList({ withMint, withBoost, isReversed: false })

        return {
          ...state,
          tab: list[0].id,
          isReversed: false,
        }
      }

      const nextIsReversed = !state.isReversed

      const currentList = getTabsList({
        withMint,
        withBoost,
        isReversed: state.isReversed,
      })

      const nextList = getTabsList({
        withMint,
        withBoost,
        isReversed: nextIsReversed,
      })

      const currentIndex = currentList
        .map(({ id }) => id)
        .indexOf(state.tab)

      const safeIndex = currentIndex === -1 ? 0 : currentIndex

      return {
        ...state,
        isReversed: nextIsReversed,
        tab: nextList[safeIndex].id,
      }
    })
  }, [ withBoost, withMint, withToggleButton, setState ])

  const resetTab = useCallback((chainId: ChainIds) => {
    const isEth = chainId === Network.Mainnet || chainId === Network.Hoodi
    const nextWithBoost = withMint && isEth && isMoreV2

    const list = getTabsList({ withMint, withBoost: nextWithBoost, isReversed: false })

    setState({
      tab: list[0].id,
      isReversed: false,
    })
  }, [ setState, withMint, isMoreV2 ])

  useChainChanged(resetTab)

  return useMemo<SwapView.Tabs.Data>(() => ({
    value: tab,
    list,
    setTab,
    toggleTabs,
  }), [
    tab,
    list,
    setTab,
    toggleTabs,
  ])
}


export default useTabs
