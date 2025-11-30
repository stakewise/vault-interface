import { createTab } from '../tab'
import { createInput } from '../input'
import { createSubmit } from '../submit'


export type Unstake = (amount?: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<Unstake, 'page' | 'transactions'>

export const createUnstake: Wrapper = ({ transactions, page }) => (
  async (amount?: string) => {
    const tab = createTab({ page })
    const input = createInput({ page })
    const submit = createSubmit({ page, transactions })

    await tab('unstake', true)

    await input.fill(amount)

    const inputAmount = await input.value()

    await submit()

    await transactions.checkTxCompletedModal({
      action: 'exitQueue',
      value: inputAmount,
    })
  }
)
