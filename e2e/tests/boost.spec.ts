import { expect } from '@playwright/test'

import * as constants from '../constants'
import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('boost')
  await swap.checkConnectButton()
})

test('Max balance', async ({ swap, wallet, page, sdk }) => {
  const initialETH = '25'
  const depositETH = '20'
  const mintETH = '15'

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

  await page.reload()
  await swap.tab('boost')

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(shares)
})

test('Boost info', async ({ swap, page, wallet, sdk, graphql }) => {
  const initialETH = '25'
  const depositETH = '20'
  const mintETH = '15'

  await swap.openPage(`skipSSR=true`)
  await wallet.connectWithBalance({ ETH: initialETH })

  await sdk.deposit({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: depositETH,
  })
  await sdk.mint({
    vaultAddress: constants.genesisAddress.mainnet,
    assets: mintETH,
  })

  const userAPY = '1.55'

  await graphql.mockUserApy(userAPY)

  await page.reload()
  await swap.tab('boost')

  await page.getByTestId('max-button').click()

  const [
    boostToken,
  ] = await Promise.all([
    swap.input.token(),
  ])

  expect(boostToken).toBe('osETH')
})

test('Boost disabled', async ({ wallet, swap, page, element }) => {
  await swap.openPage()

  await swap.mockPosition({ isClaimable: false })
  await wallet.connectWithBalance({ ETH: '50' })
  await swap.tab('boost')

  await swap.checkSubmitButton({ isDisabled: true })
  await element.checkVisibility({ testId: 'exit-queue-note', isVisible: true })

  await swap.mockPosition({ isClaimable: false })
  await page.getByTestId('balances-link').click()

  await element.checkVisibility({ testId: 'unboost-queue-claim-button', isVisible: true })

  const claimButton = await page.getByTestId('unboost-queue-claim-button')

  expect(claimButton).toBeDisabled()
})
