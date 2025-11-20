import { Tab, vaultHooks } from '../util'


declare global {

  declare namespace SwapView {

    namespace Tabs {

      type TabsList = Array<{
        id: Tab,
        title: Intl.Message
      }>

      type SetTab = (tab: Tab) => void

      type ToggleTabs = () => void

      type Data = {
        value: Tab
        list: TabsList
        setTab: SetTab
        toggleTabs: ToggleTabs
      }
    }

    type Context = {
      stake: ReturnType<typeof vaultHooks.actions.useStake>
      unstake: ReturnType<typeof vaultHooks.actions.useUnstake>

      boost: ReturnType<typeof vaultHooks.actions.useBoost>
      unboost: ReturnType<typeof vaultHooks.actions.useUnboost>

      burn: ReturnType<typeof vaultHooks.actions.useBurn>
      mint: ReturnType<typeof vaultHooks.actions.useMint>

      unboostQueue: ReturnType<typeof vaultHooks.actions.useClaimUnboostQueue>
      unstakeQueue: ReturnType<typeof vaultHooks.actions.useClaimUnstakeQueue>

      tvl: string
      tabs: Tabs.Data
      vaultAddress: string
      isFetching: boolean
    }
  }
}
