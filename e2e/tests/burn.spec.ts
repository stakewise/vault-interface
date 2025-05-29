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
  await swap.tab('burn', true)
  await swap.checkConnectButton()
})

test('Max burn', async ({ swap, wallet, graphql, sdk, page }) => {
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

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()

  await swap.tab('burn', true)

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(shares)
})

test('Burn info', async ({ wallet, swap, graphql, page, sdk }) => {
  const initialETH = '25'
  const depositETH = '20'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  await sdk.mint({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: '15',
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()

  await swap.tab('burn', true)

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
  expect(format(assetsNext)).toEqual(0)
  expect(format(apy)).toBeGreaterThan(0)
  expect(format(gas)).toBeGreaterThanOrEqual(0)
})

test('Burn', async ({ wallet, swap, graphql, page, sdk, transactions }) => {
  const initialETH = '25'
  const depositETH = '20'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })

  const shares = await sdk.mint({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: '15',
  })

  await graphql.mockAllocatorsData(depositETH)
  await page.reload()

  await swap.tab('burn', true)

  await swap.submitAmount()

  await page.waitForSelector('text=Processing transaction')
  await graphql.mockTransaction()

  await transactions.checkTxCompletedModal({
    action: 'burn',
    startsWith: shares,
  })
})
