import React from 'react'

import { TransactionsFlowModal } from 'layouts/modals'

import Tabs from './Tabs/Tabs'
import { Skeleton } from '../common'
import { StatisticsModal } from '../modals'
import { Balance, Boost, Stake, Mint, Burn, Unboost, Unstake } from '../content'

import { Tab, stakeCtx } from './util'


type VaultContextProps = {
  vaultAddress: string
}

const components = {
  [Tab.Mint]: Mint,
  [Tab.Burn]: Burn,
  [Tab.Stake]: Stake,
  [Tab.Boost]: Boost,
  [Tab.Unboost]: Unboost,
  [Tab.Unstake]: Unstake,
  [Tab.Balance]: Balance,
}

const StakeContext: React.FC<VaultContextProps> = (props) => {
  const { vaultAddress } = props

  const ctx = stakeCtx.useInit({ vaultAddress })

  const Tab = components[ctx.tabs.value as Tab]

  const content = ctx.isFetching ? (
    <Skeleton />
  ) : (
    <>
      <Tabs />
      <div className="mt-20">
        <Tab />
      </div>
    </>
  )

  return (
    <stakeCtx.Provider value={ctx}>
      {content}
      <StatisticsModal/>
      <TransactionsFlowModal />
    </stakeCtx.Provider>
  )
}


export default React.memo(StakeContext)
