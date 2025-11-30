import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('unboost', true)
  await swap.helpers.checkConnectButton()
})

test('Balance percent', async ({ swap, page, wallet, user }) => {
  const shares = '10'
  const rewards = '1'

  await swap.openPage()

  await user.balances.setBoostData({ shares, rewards })

  await wallet.connectWithBalance({ ETH: '1' })

  await swap.tab('unboost', true)

  const percents = [ '25', '50', '75', '100' ]

  for (const percent of percents) {
    await page.getByTestId(`percent-${percent}`).click()

    const [
      value,
      exitingShares,
      exitingRewards,
    ] = await Promise.all([
      swap.input.value(),
      swap.helpers.getSwapInfoItem('exiting-shares'),
      swap.helpers.getSwapInfoItem('exiting-rewards'),
    ])

    expect(value).toEqual(`${percent}%`)

    const formatValue = (value: string) => (
      Number(value) / 100 * Number(percent)
    )

    const formattedShares = formatValue(shares)
    const formattedRewards = formatValue(rewards)

    expect(parseFloat(exitingShares)).toEqual(formattedShares)
    expect(parseFloat(exitingRewards)).toEqual(formattedRewards)
  }
})

test('Unboost disabled', async ({ wallet, swap, page, element }) => {
  await swap.openPage()
  await swap.mocks.position({ isClaimable: false })
  await wallet.connectWithBalance({ ETH: '50' })

  await swap.tab('unboost', true)

  await swap.helpers.checkSubmitButton({ isDisabled: true })
  await element.checkVisibility({ testId: 'exit-queue-note', isVisible: true })

  await swap.mocks.position({ isClaimable: false })
  await page.getByTestId('balances-link').click()

  await element.checkVisibility({ testId: 'unboost-queue-claim-button', isVisible: true })
})

test('Unboost with upgrade', async ({ wallet, swap, user }) => {
  const shares = '10'
  const rewards = '1'

  await swap.openPage()

  await user.balances.setBoostData({ shares, rewards })

  await wallet.connectWithBalance({ ETH: shares, osETH: shares })

  await swap.actions.unboost({ percent: '50', rewards, shares })
})

test('Unboost', async ({ wallet, swap, user }) => {
  const shares = '10'

  await swap.openPage()

  await user.balances.setBoostData({
    shares,
    leverageStrategyData: {
      version: 2,
      isUpgradeRequired: false,
    },
  })

  await wallet.connectWithBalance({ ETH: shares, osETH: shares })

  await swap.actions.unboost({ percent: '25', withUpgrade: false, shares })
})
