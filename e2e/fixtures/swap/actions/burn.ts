import { createTab } from '../tab'
import { createInput } from '../input'
import { createSubmit } from '../submit'


export type Burn = (amount?: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<Burn, 'page' | 'transactions' | 'helpers'>

export const createBurn: Wrapper = ({ transactions, page, helpers }) => (
  async (amount?: string) => {
    const tab = createTab({ page })
    const input = createInput({ page })
    const submit = createSubmit({ page, transactions })

    await tab('burn', true)

    await input.fill(amount)

    const inputAmount = await input.value()
    const formattedAmount = helpers.formatTokenValue(inputAmount)

    await submit()

    await transactions.checkTxCompletedModal({
      action: 'burn',
      value: formattedAmount,
    })
  }
)
