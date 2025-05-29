import { expect } from '@playwright/test'

import * as constants from '../constants'
import test from '../extendTest'


const format = (value: string) => Number(value.replace(/[^\d.]/g, ''))

test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('unstake', true)
  await swap.checkConnectButton()
})

test('Max balance', async ({ swap, wallet, graphql }) => {
  const amount = '10'

  await swap.openPage()

  await graphql.mockAllocatorsData(amount)
  await wallet.connectWithBalance({ ETH: amount })

  await swap.tab('unstake', true)

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(amount)
})

test('Unstake info', async ({ wallet, swap, graphql, page, sdk }) => {
  const initialETH = '25'
  const depositETH = '20'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()
  await page.waitForLoadState('networkidle')

  await swap.tab('unstake', true)

  await swap.input.fill()

  const getPositionInfoItem = async (type: string) => {
    const selector = await page.waitForSelector(`[data-testid="position-${type}"]`)
    const value = await selector.textContent()

    return value || ''
  }

  const [
    unstakeToken,
    assetsNext,
    apy,
    gas,
  ] = await Promise.all([
    swap.input.token(),
    getPositionInfoItem('assets-next'),
    getPositionInfoItem('apy-next'),
    getPositionInfoItem('value-prev'),
  ])

  expect(format(assetsNext)).toEqual(0)
  expect(unstakeToken).toBe('ETH')
  expect(format(apy.replace(/.*=/, ''))).toBeGreaterThan(0)
  expect(format(gas)).toBeGreaterThanOrEqual(0)
})

test('Unstake', async ({ wallet, swap, graphql, page, sdk, transactions }) => {
  const initialETH = '25'
  const depositETH = '20'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()
  await page.waitForLoadState('networkidle')

  await swap.tab('unstake', true)

  await swap.submitAmount()

  await page.waitForSelector('text=Processing transaction')
  await graphql.mockTransaction()

  await transactions.checkTxCompletedModal({
    action: 'exitQueue',
    value: depositETH,
  })
})

test('Unstake after mint', async ({ wallet, swap, graphql, page, sdk }) => {
  const initialETH = '25'
  const depositETH = '20'
  const mintETH = '5'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  await sdk.mint({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: mintETH,
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()
  await page.waitForLoadState('networkidle')

  await swap.tab('unstake', true)

  await swap.input.fill()
  const value = await swap.input.value()

  expect(Math.round(Number(value))).toEqual(15)
})
