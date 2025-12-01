import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckTransactionsFlow, 'page' | 'helpers'>

type Input = {
  flow: 'boost' | 'unboost'
  token?: string
  availableSteps?: string[]
  checkNotifications?: boolean
}

export type CheckTransactionsFlow = (values: Input) => Promise<void>

const steps = {
  unboost: [ 'upgrade', 'unboost' ],
  boost: [ 'boostUpgrade', 'permit', 'boost' ],
}

const titles = {
  boost: 'Boost',
  unboost: 'Unboost',
  permit: 'Approve osETH',
  upgrade: 'Upgrade leverage strategy contract',
  boostUpgrade: 'Upgrade leverage strategy contract',
}

export const createCheckTransactionsFlow: Wrapper = ({ page, helpers }) => (
  async ({ flow, token, availableSteps, checkNotifications = true }: Input) => {
    const flowSteps = availableSteps || steps[flow]

    await page.waitForSelector('[data-testid="transactions-flow-modal"]')

    const stepTitles = await Promise.all(
      flowSteps.map((step) => page.getByTestId(`step-${step}-title`).textContent())
    )

    const expectedTitles = flowSteps.map((step) => {
      const expectedTitle = titles[step as keyof typeof titles]

      if (token) {
        return expectedTitle.replace('osETH', token)
      }

      return expectedTitle
    })

    expect(stepTitles).toEqual(expectedTitles)

    if (checkNotifications) {
      for (const _step of flowSteps) {
        await helpers.checkNotification('Transaction has been confirmed')
      }
    }
  }
)
