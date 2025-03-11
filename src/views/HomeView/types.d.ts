import { Tab } from './StakeContext/util'

import {
  useBurn,
  useMint,
  useBoost,
  useStake,
  useUnstake,
  useUnboost,
} from './StakeContext/util/actions'


declare global {

  declare namespace StakePage {

    namespace Tabs {

      type SetTab = (tab: TabsIds) => void

      type Data = {
        value: Tab
        setTab: SetTab
      }
    }

    type Data = {
      tvl: string
      fee: string
      apy: {
        user: number
        vault: number
        mintToken: number
        maxBoost: number
      }
      ltvPercent: bigint
      userRewards: bigint
      isFetching: boolean
      refetchData: () => Promise<void>
    }

    type Context = {
      data: Omit<Data, 'refetchData'>
      tabs: Tabs.Data
      burn: useBurn.mock,
      mint: useMint.mock,
      boost: useBoost.mock,
      stake: useStake.mock,
      unboost: useUnboost.mock,
      unstake: useUnstake.mock,
      field: Forms.Field<bigint>
      vaultAddress: string
      unstakeQueue: { claim: (values: Store['vault']['user']['exitQueue']['data']) => Promise<void> }
      unboostQueue: { claim: (values: Store['vault']['user']['unboostQueue']['data']) => Promise<void> }
      percentField: Forms.Field<string>
      isFetching: boolean
    }

    type Fetch = {
      data: () => Promise<void>
      unstakeQueue: () => Promise<void>
      unboostQueue: () => Promise<void>
    }

    type Params = {
      fetch: Fetch
      vaultAddress: string
    }
  }
}
