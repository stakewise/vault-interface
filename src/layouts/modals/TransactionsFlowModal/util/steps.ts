import { BoostStep, StakeStep, UnstakeStep, UnboostStep } from 'helpers/enums'
import { commonMessages, constants } from 'helpers'

import { Transaction } from 'components'

import type { TransactionsFlow } from '../types'

import messages from './messages'


const boostSteps: Omit<Transaction, 'status'>[] = [
  {
    id: BoostStep.Permit,
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
    title: commonMessages.buttonTitle.boost,
    testId: 'step-boost',
  },
]

const unboostSteps: Omit<Transaction, 'status'>[] = [
  {
    id: UnboostStep.Upgrade,
    title: commonMessages.upgradeLeverageStrategy,
    testId: 'step-upgrade',
  },
  {
    id: UnboostStep.Unboost,
    title: commonMessages.buttonTitle.unboost,
    testId: 'step-unboost',
  },
]

const stakeSteps: Omit<Transaction, 'status'>[] = [
  {
    id: StakeStep.SwapApprove,
    title: '',
    testId: 'step-swap-approve',
  },
  {
    id: StakeStep.Swap,
    title: messages.swap,
    testId: 'step-swap',
  },
  {
    id: StakeStep.Approve,
    title: '',
    testId: 'step-approve',
  },
  {
    id: StakeStep.Stake,
    title: commonMessages.buttonTitle.stake,
    testId: 'step-stake',
  },
]

const unstakeSteps: Omit<Transaction, 'status'>[] = [
  {
    id: UnstakeStep.Approve,
    title: '',
    testId: 'step-approve',
  },
  {
    id: UnstakeStep.Swap,
    title: messages.swapOnExchange,
    testId: 'step-swap',
  },
  {
    id: UnstakeStep.Queue,
    title: messages.queue,
    testId: 'step-queue',
  },
]

const steps: Record<TransactionsFlow, Omit<Transaction, 'status'>[]> = {
  stake: stakeSteps,
  boost: boostSteps,
  unboost: unboostSteps,
  unstake: unstakeSteps,
}


export default steps
