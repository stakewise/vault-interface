import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckSubmitButton, 'page' | 'element'>

type Input = {
  text?: string
  isLoading?: boolean
  isDisabled: boolean
}

export type CheckSubmitButton = (values: Input) => Promise<void>

export const createCheckSubmitButton: Wrapper = ({ page, element }) => (
  async (values: Input) => {
    const { text, isLoading, isDisabled } = values

    const testId = 'submit-button'
    const submitButton = page.getByTestId(testId)

    if (typeof isLoading === 'boolean') {
      await expect(submitButton).toHaveAttribute('data-loading', `${isLoading}`)
    }

    if (isDisabled) {
      await expect(submitButton).toBeDisabled()
    }
    else {
      await expect(submitButton).not.toBeDisabled()
    }

    if (text) {
      await element.checkText({ testId, expectedText: text })
    }
  }
)
