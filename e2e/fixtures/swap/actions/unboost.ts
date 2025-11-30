import { createTab } from '../tab'
import { createInput } from '../input'
import { createSubmitAmount } from '../submitAmount'

import type { TransactionItem } from '../../transactions/checkTxCompletedModal'


type Input = {
  percent: string
  shares: string
  rewards?: string
  withUpgrade?: boolean
}

export type Unboost = (values?: Input) => Promise<void>

type Wrapper = E2E.FixtureMethod<Unboost, 'page' | 'transactions' | 'api'>

export const createUnboost: Wrapper = ({ transactions, api, page }) => (
  async (values?: Input) => {
    const { percent, withUpgrade = true, shares, rewards } = values || {}

    const tab = createTab({ page })
    const input = createInput({ page })
    const submit = createSubmitAmount({ page })

    await tab('unboost', true)

    await input.fill(percent)

    await submit()

    const unrouteEstimateGas = await api.mockEstimateGas()

    if (withUpgrade) {
      await transactions.checkTransactionsFlow({
        flow: 'unboost',
        availableSteps: [ 'upgrade', 'unboost' ],
        checkNotifications: false,
      })
    }

    const exitingShares = Number(shares) * (Number(percent) / 100)

    const steps: TransactionItem[] = [
      {
        action: 'exiting',
        value: String(exitingShares),
      },
    ]

    if (rewards) {
      const exitingReward =  Number(rewards) * (Number(percent) / 100)

      steps.push({
        action: 'exitingReward',
        value: String(exitingReward),
      })
    }

    await transactions.checkTxCompletedModal(...steps)

    await unrouteEstimateGas()
  }
)
