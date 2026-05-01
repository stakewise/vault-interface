import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ wallet }) => {
  await wallet.init()
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('boost')
  await swap.helpers.checkConnectButton()
})

test('Max balance', async ({ swap, wallet }) => {
  const initialETH = '25'
  const depositETH = '20'
  const mintETH = '15'

  await swap.openPage()

  await wallet.connectWithBalance({ ETH: initialETH })

  const shares = await swap.setSdkTransactions({ deposit: depositETH, mint: mintETH })

  await swap.tab('boost')

  await swap.input.fill()

  const value = await swap.input.value()

  expect(value).toEqual(shares)
})

test('Boost info', async ({ swap, page, wallet }) => {
  const initialETH = '25'
  const depositETH = '20'
  const mintETH = '15'

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: initialETH })

  await swap.setSdkTransactions({ deposit: depositETH, mint: mintETH })

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

test('Boost not profitable', async ({ user, wallet, swap, vault }) => {
  await vault.setVaultData({
    allocatorMaxBoostApy: '1',
    apy: '5',
  })

  await swap.openPage('skipSSR=true')

  const amount = '10'

  await user.balances.setMintTokenData({ stakedAssets: amount, mintedShares: amount })

  await wallet.connectWithBalance({ ETH: '50', osETH: '50' })
  await swap.tab('boost')
  await swap.input.fill('1')

  await swap.helpers.checkSubmitButton({ text: 'Not profitable', isLoading: false, isDisabled: true })
})

test('Boost disabled', async ({ wallet, swap, page, element }) => {
  await swap.openPage()

  await swap.mocks.position({ isClaimable: false })
  await wallet.connectWithBalance({ ETH: '50' })
  await swap.tab('boost')

  await swap.helpers.checkSubmitButton({ isDisabled: true })
  await element.checkVisibility({ testId: 'exit-queue-note', isVisible: true })

  await swap.mocks.position({ isClaimable: false })
  await page.getByTestId('balances-link').click()

  await element.checkVisibility({ testId: 'unboost-queue-claim-button', isVisible: true })

  const claimButton = await page.getByTestId('unboost-queue-claim-button')

  expect(claimButton).toBeDisabled()
})

test.skip('Boost with permit', async ({ wallet, swap, user }) => {
  const amount = '10'

  await swap.mocks.boostInfo()

  await swap.openPage('skipSSR=true')

  await user.balances.setMintTokenData({ stakedAssets: amount, mintedShares: amount })

  await wallet.connectWithBalance({ ETH: amount, osETH: amount })

  await swap.actions.boost({ amount: '1' })
})

test.skip('Boost with upgrade', async ({ wallet, swap, user }) => {
  const amount = '10'

  await swap.mocks.boostInfo()

  await swap.openPage('skipSSR=true')

  await user.balances.setMintTokenData({ stakedAssets: amount, mintedShares: amount })

  await user.balances.setBoostData({ shares: '1' })

  await wallet.connectWithBalance({ ETH: amount, osETH: amount })

  await swap.actions.boost({ amount: '1', withUpgrade: true })
})
