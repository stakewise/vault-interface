import { expect } from '@playwright/test'


export type RewardsFixture = {
  checkExport: () => Promise<void>
}

const rewards: E2E.Fixture<RewardsFixture> = async ({ page, helpers, graphql }, use) => {

  const checkExport = async () => {
    await page.getByTestId('user-stats-chart-tab').click()
    await page.getByTestId('export-rewards-button').click()

    await page.getByTestId('export-rewards-from-input').fill('2024-01-01')
    await page.getByTestId('export-rewards-to-input').fill('2024-01-31')
    await page.getByTestId('export-rewards-format-select-button').click()

    const formatOptions = await page.waitForSelector('[data-testid="export-rewards-format-select-options"]')

    const options = await formatOptions.$$('> *')
    expect(options.length).toBe(2)

    await page.getByTestId('export-rewards-format-select-option-xlsx').click()

    const downloadButton = page.getByTestId('export-rewards-download-button')

    await expect(downloadButton).not.toBeDisabled()

    await graphql.mockStakeStats()
    await graphql.mockUserRewards()
    await downloadButton.click()

    await helpers.checkNotification('Staking stats successfully downloaded')
  }

  await use({
    checkExport,
  })
}


export default rewards
