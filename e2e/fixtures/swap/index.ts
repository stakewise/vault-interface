import { createTab, Tab } from './tab'
import { createInput, Input } from './input'
import { createSubmit, Submit } from './submit'
import { createMockApy, MockApy } from './mockApy'
import { createOpenPage, OpenPage } from './openPage'
import { createSubmitAmount, SubmitAmount } from './submitAmount'
import { createMockPosition, MockPosition } from './mockPosition'
import { createCheckSwapRender, CheckSwapRender } from './checkSwapRender'
import { createGetBaseInfoItem, GetBaseInfoItem } from './getBaseInfoItem'
import { createGetSwapInfoItem, GetSwapInfoItem } from './getSwapInfoItem'
import { createCheckSubmitButton, CheckSubmitButton } from './checkSubmitButton'
import { createCheckConnectButton, CheckConnectButton } from './checkConnectButton'


export type SwapFixture = {
  tab: Tab
  input: Input
  submit: Submit
  mockApy: MockApy
  openPage: OpenPage
  mockPosition: MockPosition
  submitAmount: SubmitAmount
  checkSwapRender: CheckSwapRender
  getBaseInfoItem: GetBaseInfoItem
  getSwapInfoItem: GetSwapInfoItem
  checkSubmitButton: CheckSubmitButton
  checkConnectButton: CheckConnectButton
}

const swap: E2E.Fixture<SwapFixture> = async ({ page, graphql, transactions, element, user }, use) => {
  await use({
    tab: createTab({ page }),
    input: createInput({ page }),
    openPage: createOpenPage({ page }),
    mockApy: createMockApy({ graphql }),
    submitAmount: createSubmitAmount({ page }),
    submit: createSubmit({ page, transactions }),
    mockPosition: createMockPosition({ user }),
    checkSwapRender: createCheckSwapRender({ page }),
    getSwapInfoItem: createGetSwapInfoItem({ page }),
    getBaseInfoItem: createGetBaseInfoItem({ page }),
    checkConnectButton: createCheckConnectButton({ page }),
    checkSubmitButton: createCheckSubmitButton({ page, element }),
  })
}


export default swap
