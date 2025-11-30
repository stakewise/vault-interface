import { createTab } from '../tab'
import { createInput } from '../input'
import { createSubmit } from '../submit'


export type Stake = (amount?: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<Stake, 'page' | 'transactions' | 'user'>

export const createStake: Wrapper = ({ page, transactions, user }) => (
  async (amount?: string) => {
    const tab = createTab({ page })
    const input = createInput({ page })
    const submit = createSubmit({ page, transactions })

    await tab('stake')

    await input.fill(amount)

    const inputAmount = await input.value()

    await Promise.all([
      submit(),
      user.balances.setStakeBalance(inputAmount),
      user.balances.setMaxWithdrawAssets(inputAmount),
      user.balances.setMintTokenData({ mintedShares: '0', stakedAssets: inputAmount }),
    ])

    await transactions.checkTxCompletedModal({
      action: 'stake',
      value: inputAmount,
    })
  }
)
