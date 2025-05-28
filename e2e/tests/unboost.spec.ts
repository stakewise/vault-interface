import { expect } from '@playwright/test'

import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Connect button', async ({ swap }) => {
  await swap.openPage()
  await swap.tab('unboost', true)
  await swap.checkConnectButton()
})

test('Balance percent', async ({ swap, page, wallet, graphql }) => {
  const shares = '10'

  await swap.openPage()
  await graphql.mockBoostData({ shares: '10' })

  const userAPY = '1.55'

  await graphql.mockUserApy(userAPY)
  await wallet.connectWithBalance({ ETH: '1' })

  await swap.tab('unboost', true)

  const percents = [ '25', '50', '75', '100' ]

  const formatValue = (value: string, percent: string) => (
    Number(value) / 100 * Number(percent)
  )

  for (const percent of percents) {
    await page.getByTestId(`percent-${percent}`).click()

    const [
      value,
      exitingShares,
    ] = await Promise.all([
      swap.input.value(),
      swap.getSwapInfoItem('boosted-shares-next', 'position'),
    ])

    expect(value).toEqual(`${percent}%`)

    const formattedShares = Number(shares) - formatValue(shares, percent)

    expect(parseFloat(exitingShares)).toEqual(formattedShares)
  }
})

test('Unboost disabled', async ({ wallet, swap, page, element }) => {
  await swap.openPage()
  await swap.mockPosition({ isClaimable: false })
  await wallet.connectWithBalance({ ETH: '50' })

  await swap.tab('unboost', true)

  await swap.checkSubmitButton({ isDisabled: true })
  await element.checkVisibility({ testId: 'exit-queue-note', isVisible: true })

  await swap.mockPosition({ isClaimable: false })
  await page.getByTestId('balances-link').click()

  await element.checkVisibility({ testId: 'unboost-queue-claim-button', isVisible: true })
})
