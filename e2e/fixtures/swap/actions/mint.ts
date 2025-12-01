import { createTab } from '../tab'
import { createInput } from '../input'
import { createSubmit } from '../submit'


type Input = {
  amount?: string
  stakedAssets: string
}

export type Mint = (values: Input) => Promise<void>

type Wrapper = E2E.FixtureMethod<Mint, 'page' | 'transactions' | 'helpers' | 'user'>

export const createMint: Wrapper = ({ transactions, page, helpers, user }) => (
  async (values: Input) => {
  const { amount, stakedAssets } = values

    const tab = createTab({ page })
    const input = createInput({ page })
    const submit = createSubmit({ page, transactions })

    await tab('mint')

    await input.fill(amount)

    const inputAmount = await input.value()
    const formattedAmount = helpers.formatTokenValue(inputAmount)

    await Promise.all([
      submit(),
      user.balances.setMaxWithdrawAssets(stakedAssets),
      user.balances.setMintTokenData({ mintedShares: inputAmount, stakedAssets }),
    ])

    await transactions.checkTxCompletedModal({
      action: 'mint',
      value: formattedAmount,
    })
  }
)
