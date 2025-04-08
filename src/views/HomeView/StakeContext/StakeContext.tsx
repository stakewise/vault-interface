import React from 'react'

import { TxCompletedModal, ExportRewardsModal, TransactionsFlowModal, DistributorClaimsModal } from 'layouts/modals'

import Tabs from './Tabs/Tabs'
import { Skeleton } from '../common'
import { StatisticsModal } from '../modals'
import { Balance, Boost, Stake, Mint, Burn, Unboost, Unstake } from '../content'

import { Tab, stakeCtx } from './util'


const components = {
  [Tab.Mint]: Mint,
  [Tab.Burn]: Burn,
  [Tab.Stake]: Stake,
  [Tab.Boost]: Boost,
  [Tab.Unboost]: Unboost,
  [Tab.Unstake]: Unstake,
  [Tab.Balance]: Balance,
}

const StakeContext: React.FC = () => {
  const ctx = stakeCtx.useInit()
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
      <StatisticsModal />
      <TxCompletedModal />
      <ExportRewardsModal />
      <TransactionsFlowModal />
      <DistributorClaimsModal />
    </stakeCtx.Provider>
  )
}


export default React.memo(StakeContext)
