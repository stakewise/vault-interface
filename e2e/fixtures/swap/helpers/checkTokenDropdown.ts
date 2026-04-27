import { expect, Locator } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckTokenDropdown, 'page' | 'element'>

export type CheckTokenDropdown = (network?: string) => Promise<void>

const TRIGGER_TIMEOUT = 15_000

const clickTrigger = async (trigger: Locator) => {
  await expect(trigger).toBeEnabled({ timeout: TRIGGER_TIMEOUT })
  await trigger.click()
}

export const createCheckTokenDropdown: Wrapper = ({ page, element }) => (
  async (network?: string) => {
    const stakeToken = network === 'gnosis' ? 'GNO' : 'ETH'
    const trigger = page.getByTestId('amount-input-token')

    await clickTrigger(trigger)

    await element.checkVisibility({ testId: 'amount-input-input' })
    await element.checkVisibility({ testId: 'amount-input-option-USDT' })

    await page.getByTestId('amount-input-option-USDT').click()

    await element.checkText({ testId: 'amount-input-token', expectedText: 'USDT' })

    await clickTrigger(trigger)

    await element.checkVisibility({ testId: 'amount-input-input' })
    await page.getByTestId('amount-input-input').fill(stakeToken)

    await element.checkVisibility({ testId: `amount-input-option-${stakeToken}` })
    await element.checkVisibility({ testId: 'amount-input-option-USDT', isVisible: false })

    await page.getByTestId(`amount-input-option-${stakeToken}`).click()
  }
)
