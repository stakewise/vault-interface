import { createTab, Tab } from './tab'
import { createInput, Input } from './input'
import { createSubmit, Submit } from './submit'
import { createMockApy, MockApy } from './mockApy'
import { createOpenPage, OpenPage } from './openPage'
import { createSetSwapStats, SetSwapStats } from './setSwapStats'
import { createSubmitAmount, SubmitAmount } from './submitAmount'
import { createMockPosition, MockPosition } from './mockPosition'
import { createCheckSwapRender, CheckSwapRender } from './checkSwapRender'
import { createGetBaseInfoItem, GetBaseInfoItem } from './getBaseInfoItem'
import { createCheckSubmitButton, CheckSubmitButton } from './checkSubmitButton'
import { createCheckConnectButton, CheckConnectButton } from './checkConnectButton'

import { createGetSwapInfoItem } from './helpers'
import type { GetSwapInfoItem } from './helpers'


export type SwapFixture = {
  tab: Tab
  input: Input
  submit: Submit
  mockApy: MockApy
  openPage: OpenPage
  setSwapStats: SetSwapStats
  mockPosition: MockPosition
  submitAmount: SubmitAmount
  checkSwapRender: CheckSwapRender
  getBaseInfoItem: GetBaseInfoItem
  checkSubmitButton: CheckSubmitButton
  checkConnectButton: CheckConnectButton

  helpers: {
    getSwapInfoItem: GetSwapInfoItem
  }
}

const swap: E2E.Fixture<SwapFixture> = async ({ page, graphql, transactions, element, user }, use) => {
  await use({
    tab: createTab({ page }),
    input: createInput({ page }),
    openPage: createOpenPage({ page }),
    mockApy: createMockApy({ graphql }),
    setSwapStats: createSetSwapStats({ page }),
    submitAmount: createSubmitAmount({ page }),
    submit: createSubmit({ page, transactions }),
    mockPosition: createMockPosition({ user }),
    checkSwapRender: createCheckSwapRender({ page }),
    getBaseInfoItem: createGetBaseInfoItem({ page }),
    checkConnectButton: createCheckConnectButton({ page }),
    checkSubmitButton: createCheckSubmitButton({ page, element }),

    helpers: {
      getSwapInfoItem: createGetSwapInfoItem({ page }),
    },
  })
}


export default swap
