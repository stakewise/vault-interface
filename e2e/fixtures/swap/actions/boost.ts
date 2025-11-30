import { createTab } from '../tab'
import { createInput } from '../input'
import { createSubmitAmount } from '../submitAmount'


type Input = {
  amount?: string
  withUpgrade?: boolean
}

export type Boost = (values: Input) => Promise<void>

type Wrapper = E2E.FixtureMethod<Boost, 'page' | 'transactions' | 'api'>

export const createBoost: Wrapper = ({ page, transactions, api }) => (
  async (values: Input) => {
    const { amount, withUpgrade } = values

    const tab = createTab({ page })
    const input = createInput({ page })
    const submit = createSubmitAmount({ page })

    await tab('boost')

    await input.fill(amount)

    const inputAmount = await input.value()

    await submit()

    const unrouteEstimateGas = await api.mockEstimateGas()

    const steps = [ 'permit', 'boost' ]

    if (withUpgrade) {
      steps.unshift('boostUpgrade')
    }

    await transactions.checkTransactionsFlow({
      flow: 'boost',
      availableSteps: steps,
      checkNotifications: false,
    })

    await page.waitForLoadState('networkidle')

    await transactions.checkTxCompletedModal({
      action: 'boost',
      value: inputAmount,
    })

    await unrouteEstimateGas()
  }
)
