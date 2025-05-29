type Wrapper = E2E.FixtureMethod<CheckTransaction, 'helpers' | 'element' | 'graphql'>

type Input = {
  withSentMessage?: boolean
  withBottomLoader?: boolean
}

export type CheckTransaction = (values?: Input) => Promise<void>

export const createCheckTransaction: Wrapper = ({ element, helpers, graphql }) => (
  async (values?: Input) => {
    const { withBottomLoader, withSentMessage = true } = values || {}

    if (withSentMessage) {
      await helpers.checkNotification('The transaction has been sent. Please wait for it to be confirmed.')
    }

    if (withBottomLoader) {
      await element.checkText({ testId: 'bottom-loader-text', expectedText: 'Processing transaction' })
      await graphql.mockTransaction()
    }

    await helpers.checkNotification('Transaction has been confirmed')
  }
)
