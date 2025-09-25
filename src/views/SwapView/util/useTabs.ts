import { useCallback, useMemo } from 'react'
import { Network } from 'sdk'
import { useConfig } from 'config'
import { useStore, useObjectState, useChainChanged } from 'hooks'

import getTabsList from './getTabsList'

import { Tab } from './enum'


type State = {
  tab: Tab
  list: SwapView.Tabs.Data['list']
  isReversed: boolean
}

export const tabsMock: SwapView.Tabs.Data = {
  list: [],
  value: Tab.Stake,
  setTab: (() => {}) as SwapView.Tabs.SetTab,
  toggleTabs: () => {},
}

const storeSelector = (store: Store) => ({
  isMoreV2: store.vault.base.data.versions.isMoreV2,
  isMintTokenDisabled: store.vault.user.balances.mintToken.isDisabled,
})

const useTabs = (resetFields: () => void) => {
  const { isEthereum } = useConfig()

  const { isMoreV2, isMintTokenDisabled } = useStore(storeSelector)

  const withMint = !isMintTokenDisabled
  const withBoost = withMint && isEthereum && isMoreV2
  const withToggleButton = withMint || withBoost

  const [ { tab, list }, setState ] = useObjectState<State>({
    tab: Tab.Stake,
    isReversed: false,
    list: getTabsList({ withMint, withBoost, isReversed: false }),
  })

  const getCurrentIndex = useCallback((state: State) => {
    const { tab, list } = state

    return list.map(({ id }) => id).indexOf(tab)
  }, [])

  const setTab = useCallback((tab: Tab) => {
    const isValid = Object.values(Tab).includes(tab)

    if (isValid) {
      setState((state) => {
        const isExists = Boolean(state.list.some(({ id }) => id === tab))

        if (!isExists) {
          console.error(`Invalid tab "${tab}", on list:`, state.list)

          return state
        }

        resetFields()

        return {
          ...state,
          tab,
        }
      })
    }
  }, [ setState, resetFields ])

  const toggleTabs = useCallback(() => {
    setState((state) => {
      if (!withToggleButton) {
        const list = getTabsList({ withMint, withBoost, isReversed: false })

        return {
          list,
          tab: list[0].id,
          isReversed: false,
        }
      }

      const isReversed = !state.isReversed
      const list = getTabsList({ withMint, withBoost, isReversed })
      const index = getCurrentIndex(state)

      return {
        list,
        isReversed,
        tab: list[index].id,
      }
    })
  }, [ withBoost, withMint, withToggleButton, getCurrentIndex, setState ])

  const resetTab = useCallback((chainId: ChainIds) => {
    const isEth = chainId === Network.Mainnet || chainId === Network.Hoodi
    const nextWithBoost = withMint && isEth && isMoreV2

    const list = getTabsList({ withMint, withBoost: nextWithBoost, isReversed: false })

    setState({
      list,
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
