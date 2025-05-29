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
  await swap.tab('mint')
  await swap.checkConnectButton()
})

test('Max mint', async ({ swap, wallet, graphql, sdk }) => {
  const amount = '10'

  await swap.openPage()

  await graphql.mockAllocatorsData(amount)
  await wallet.connectWithBalance({ ETH: amount })

  const shares = await sdk.getMaxMint({
    vaultAddress: constants.genesisAddress.mainnet,
    ltvPercent: '999900000000000000',
    mintedAssets: '0',
    stakedAssets: amount,
  })

  await swap.tab('mint')

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(shares)
})

test('Mint info', async ({ wallet, swap, graphql, page, sdk }) => {
  const initialETH = '25'
  const depositETH = '20'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  const shares = await sdk.getMaxMint({
    vaultAddress: constants.genesisAddress.mainnet,
    ltvPercent: '999900000000000000',
    mintedAssets: '0',
    stakedAssets: depositETH,
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()

  await swap.tab('mint')

  await swap.input.fill()

  const getPositionInfoItem = async (type: string) => {
    const selector = await page.waitForSelector(`[data-testid="position-${type}"]`)
    const value = await selector.textContent()

    return value || ''
  }

  const [
    mintToken,
    assetsNext,
    apy,
    gas,
  ] = await Promise.all([
    swap.input.token(),
    getPositionInfoItem('shares-next'),
    getPositionInfoItem('apy-next'),
    getPositionInfoItem('value-prev'),
  ])

  expect(mintToken).toEqual('osETH')
  expect(shares.startsWith(assetsNext)).toBeTruthy()
  expect(format(apy.replace(/.*=/, ''))).toBeGreaterThan(0)
  expect(format(gas)).toBeGreaterThanOrEqual(0)
})

test('Mint', async ({ wallet, swap, graphql, page, sdk, transactions }) => {
  const initialETH = '25'
  const depositETH = '20'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  const shares = await sdk.getMaxMint({
    vaultAddress: constants.genesisAddress.mainnet,
    ltvPercent: '999900000000000000',
    mintedAssets: '0',
    stakedAssets: depositETH,
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()

  await swap.tab('mint')

  await swap.submitAmount()

  await page.waitForSelector('text=Processing transaction')
  await graphql.mockTransaction()

  await transactions.checkTxCompletedModal({
    action: 'mint',
    startsWith: shares,
  })
})

test('Mint after mint', async ({ wallet, swap, graphql, page, sdk }) => {
  const initialETH = '25'
  const depositETH = '20'
  const mintETH = '5'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  const shares = await sdk.mint({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: mintETH,
  })

  const maxMint = await sdk.getMaxMint({
    vaultAddress: constants.genesisAddress.mainnet,
    ltvPercent: '999900000000000000',
    mintedAssets: shares,
    stakedAssets: depositETH,
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()
  await page.waitForLoadState('networkidle')

  await swap.tab('mint')

  await swap.input.fill()
  const value = await swap.input.value()

  expect(Math.floor(Number(value))).toEqual(Math.floor(Number(maxMint)))
})
