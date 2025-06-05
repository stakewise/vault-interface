import { BoostStep, StakeStep, UnstakeStep } from 'helpers/enums'
import { commonMessages, constants } from 'helpers'

import { Transaction, Transactions } from 'components'

import { TransactionsFlow } from '../types'

import messages from './messages'


const boostSteps: Transaction[] = [
  {
    id: BoostStep.Permit,
    status: Transactions.Status.Confirm,
    title: {
      ...commonMessages.buttonTitle.approve,
      values: {
        token: constants.tokens.osETH,
      },
    },
    testId: 'step-permit',
  },
  {
    id: BoostStep.Boost,
    status: Transactions.Status.Pending,
    title: commonMessages.buttonTitle.boost,
    testId: 'step-boost',
  },
]

const stakeSteps: Transaction[] = [
  {
    id: StakeStep.SwapApprove,
    status: Transactions.Status.Confirm,
    title: '',
    testId: 'step-swap-approve',
  },
  {
    id: StakeStep.Swap,
    status: Transactions.Status.Pending,
    title: messages.swap,
    testId: 'step-swap',
  },
  {
    id: StakeStep.Approve,
    status: Transactions.Status.Pending,
    title: '',
    testId: 'step-approve',
  },
  {
    id: StakeStep.Stake,
    status: Transactions.Status.Pending,
    title: commonMessages.buttonTitle.stake,
    testId: 'step-stake',
  },
]

const unstakeSteps: Transaction[] = [
  {
    id: UnstakeStep.Swap,
    status: Transactions.Status.Pending,
    title: messages.swapOnExchange,
    testId: 'step-swap',
  },
  {
    id: UnstakeStep.Queue,
    status: Transactions.Status.Pending,
    title: messages.queue,
    testId: 'step-queue',
  },
]

const steps: Record<TransactionsFlow, Transaction[]> = {
  stake: stakeSteps,
  boost: boostSteps,
  unstake: unstakeSteps,
}


export default steps
