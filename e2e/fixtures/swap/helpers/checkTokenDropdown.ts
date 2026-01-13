type Wrapper = E2E.FixtureMethod<CheckTokenDropdown, 'page' | 'element'>

export type CheckTokenDropdown = (network?: string) => Promise<void>

export const createCheckTokenDropdown: Wrapper = ({ page, element }) => (
  async (network?: string) => {
    const stakeToken = network === 'gnosis' ? 'GNO' : 'ETH'

    await page.getByTestId('amount-input-token').click()

    await page.waitForLoadState('networkidle')

    await element.checkVisibility({ testId: 'amount-input-input' })
    await element.checkVisibility({ testId: 'amount-input-option-USDT' })

    await page.getByTestId('amount-input-option-USDT').click()

    await element.checkText({ testId: 'amount-input-token', expectedText: 'USDT' })

    await page.getByTestId('amount-input-token').click()

    await page.waitForLoadState('networkidle')

    await page.getByTestId('amount-input-input').fill(stakeToken)

    await element.checkVisibility({ testId: `amount-input-option-${stakeToken}` })
    await element.checkVisibility({ testId: 'amount-input-option-USDT', isVisible: false })

    await page.getByTestId(`amount-input-option-${stakeToken}`).click()
  }
)
