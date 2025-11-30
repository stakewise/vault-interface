import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Enabled claim', async ({ wallet, swap, queue, user }) => {
  await swap.openPage()

  const { exitedAssets, totalAssets } = await user.setUnstakeQueue({ isClaimable: true })
  const { exitingShares, exitingRewards } = await swap.mocks.position({ isClaimable: true })

  await wallet.connectWithBalance({ ETH: '10' })
  await swap.tab('balance')

  await queue.checkUnstakeBalances({
    totalAssets,
    exitedAssets,
    isClaimable: true,
  })

  await queue.checkUnboostBalances({
    exitingShares,
    exitingRewards,
    isClaimable: true,
  })
})

test('Disabled claim', async ({ wallet, swap, user, queue }) => {
  await swap.openPage()

  const { exitingShares, exitingRewards } = await swap.mocks.position({ isClaimable: false })
  const { exitedAssets, totalAssets } = await user.setUnstakeQueue({ isClaimable: false })

  await wallet.connectWithBalance({ ETH: '10' })
  await swap.tab('balance')

  await queue.checkUnboostBalances({
    exitingShares,
    exitingRewards,
    isClaimable: false,
  })

  await queue.checkUnstakeBalances({
    totalAssets,
    exitedAssets,
    isClaimable: false,
  })
})

test('Chart', async ({ swap, page, element }) => {
  await swap.openPage()

  await swap.tab('balance')
  await page.getByTestId('statistics-button').click()

  await page.waitForResponse((response) => (
    response.url().includes('?opName=VaultStats') && response.status() === 200
  ))

  await element.checkVisibility({ testId: 'stake-user-stats-chart-tab', isVisible: false })
  await element.checkVisibility({ testId: 'vault-stats-chart-tab' })
  await element.checkVisibility({ testId: 'stake-chart-vault-rewards' })
})

test('Export rewards', async ({ wallet, swap, user, page }) => {
  await swap.openPage()

  await swap.mocks.position({ isClaimable: false })

  await wallet.connectWithBalance({ ETH: '10' })
  await swap.tab('balance')

  await user.setUserStats()

  await page.getByTestId('statistics-button').click()

  await user.checkExportRewards()
})
