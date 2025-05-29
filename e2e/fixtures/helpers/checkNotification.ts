import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckNotification, 'page' | 'element'>

export type CheckNotification = (text: string, notificationType?: string) => Promise<void>

export const createCheckNotification: Wrapper = ({ page, element }) => (
  async (text: string, notificationType = 'success') => {
    const dataTestId = `notification-${notificationType}`

    await element.checkVisibility({ testId: dataTestId })

    const notification = page.getByTestId(dataTestId).filter({ hasText: text })

    await expect(notification).toBeVisible()

    await notification.getByTestId(`${dataTestId}-close-button`).click()
  }
)
