'use client'
import React from 'react'

import Tabs from './Tabs/Tabs'
import { Skeleton } from './common'
import { Tab, swapCtx } from './util'
import { StatisticsModal } from './modals'
import { Balance, Boost, Stake, Mint, Burn, Unboost, Unstake } from './content'


const components = {
  [Tab.Mint]: Mint,
  [Tab.Burn]: Burn,
  [Tab.Stake]: Stake,
  [Tab.Boost]: Boost,
  [Tab.Unboost]: Unboost,
  [Tab.Unstake]: Unstake,
  [Tab.Balance]: Balance,
}

const SwapView: React.FC = () => {
  const ctx = swapCtx.useInit()

  const Tab = components[ctx.tabs.value as Tab]

  return (
    <div className="width-container">
      <div className="max-w-[515px] mx-auto mb-40 mt-96">
        <swapCtx.Provider value={ctx}>
          {
            ctx.isFetching ? (
              <Skeleton />
            ) : (
              <>
                <Tabs />
                <div className="mt-20">
                  <Tab />
                </div>
              </>
            )
          }
          <StatisticsModal/>
        </swapCtx.Provider>
      </div>
    </div>
  )
}


export default React.memo(SwapView)
