import { expect } from '@playwright/test'
import { createSetUserRewards } from './setUserRewards'


export type CheckExportRewards = () => Promise<void>

type Wrapper = E2E.FixtureMethod<CheckExportRewards, 'page' | 'helpers'>

export const createCheckExportRewards: Wrapper = ({ page, helpers }) => (
  async () => {
    const setUserRewards = createSetUserRewards({ page })

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

    await setUserRewards()
    await downloadButton.click()

    await helpers.checkNotification('Staking stats successfully downloaded')
  }
)
