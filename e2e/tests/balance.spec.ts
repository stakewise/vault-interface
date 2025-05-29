import test from '../extendTest'


test.beforeEach(async ({ gui, guardian }) => {
  await guardian.fixProvider()
  await gui.initializeChain(1)
})

test('Enabled claim', async ({ wallet, swap, graphql, queue }) => {
  await swap.openPage()

  const { exitedAssets, totalAssets } = await graphql.mockExitQueue({ isClaimable: true })
  const { exitingShares, exitingRewards } = await swap.mockPosition({ isClaimable: true })

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

test('Disabled claim', async ({ wallet, swap, graphql, queue }) => {
  await swap.openPage()

  const { exitedAssets, totalAssets } = await graphql.mockExitQueue({ isClaimable: false })
  const { exitingShares, exitingRewards } = await swap.mockPosition({ isClaimable: false })

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
  await element.checkVisibility({ testId: 'stake-chart-Vault-rewards' })
})

test('Export rewards', async ({ wallet, swap, graphql, rewards, page }) => {
  await swap.mockPosition({ isClaimable: false })

  await swap.openPage()
  await wallet.connectWithBalance({ ETH: '10' })
  await swap.tab('balance')

  await graphql.mockUserRewards()
  await page.getByTestId('statistics-button').click()

  await rewards.checkExport()
})
