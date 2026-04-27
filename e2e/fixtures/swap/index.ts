import { createTab, Tab } from './tab'
import { createInput, Input } from './input'
import { createSubmit, Submit } from './submit'
import { createOpenPage, OpenPage } from './openPage'
import { createSubmitAmount, SubmitAmount } from './submitAmount'
import { createSetSdkTransactions, SetSdkTransactions } from './setSdkTransactions'

import {
  createMint,
  createBurn,
  createBoost,
  createStake,
  createUnstake,
  createUnboost,
} from './actions'
import type { Stake, Unstake, Boost, Burn, Unboost, Mint } from './actions'

import { createPosition, createSwapStats, createBoostInfo } from './mocks'
import type { Position, SwapStats, BoostInfo } from './mocks'

import {
  createGetBaseInfoItem,
  createGetSwapInfoItem,
  createCheckSwapRender,
  createCheckSubmitButton,
  createCheckConnectButton,
  createCheckTokenDropdown,
} from './helpers'
import type {
  CheckSwapRender,
  GetBaseInfoItem,
  GetSwapInfoItem,
  CheckSubmitButton,
  CheckTokenDropdown,
  CheckConnectButton,
} from './helpers'


export type SwapFixture = {
  tab: Tab
  input: Input
  submit: Submit
  openPage: OpenPage
  submitAmount: SubmitAmount

  setSdkTransactions: SetSdkTransactions

  actions: {
    burn: Burn
    mint: Mint
    boost: Boost
    stake: Stake
    unstake: Unstake
    unboost: Unboost
  }

  mocks: {
    position: Position
    swapStats: SwapStats
    boostInfo: BoostInfo
  }

  helpers: {
    getSwapInfoItem: GetSwapInfoItem
    getBaseInfoItem: GetBaseInfoItem

    checkSwapRender: CheckSwapRender
    checkSubmitButton: CheckSubmitButton
    checkConnectButton: CheckConnectButton
    checkTokenDropdown: CheckTokenDropdown
  }
}

const swap: E2E.Fixture<SwapFixture> = async ({ page, graphql, transactions, element, user, api, sdk, vault, helpers }, use) => {
  await use({
    tab: createTab({ page }),
    input: createInput({ page }),
    openPage: createOpenPage({ page }),
    submitAmount: createSubmitAmount({ page }),
    submit: createSubmit({ page, transactions }),

    setSdkTransactions: createSetSdkTransactions({ page, sdk, graphql }),

    actions: {
      unstake: createUnstake({ page, transactions }),
      boost: createBoost({ page, transactions, api }),
      burn: createBurn({ page, transactions, helpers }),
      unboost: createUnboost({ page, transactions, api }),
      mint: createMint({ page, transactions, helpers, user }),
      stake: createStake({ page, transactions, user, helpers }),
    },

    mocks: {
      position: createPosition({ user }),
      swapStats: createSwapStats({ page }),
      boostInfo: createBoostInfo({ graphql, vault }),
    },

    helpers: {
      getSwapInfoItem: createGetSwapInfoItem({ page }),
      getBaseInfoItem: createGetBaseInfoItem({ page }),

      checkSwapRender: createCheckSwapRender({ page }),
      checkConnectButton: createCheckConnectButton({ page }),
      checkSubmitButton: createCheckSubmitButton({ page, element }),
      checkTokenDropdown: createCheckTokenDropdown({ page, element }),
    },
  })
}


export default swap
