import { commonMessages } from 'helpers'
import { Tab } from 'views/HomeView/StakeContext/util'


const baseTabsList = [
  { id: Tab.Stake, title: commonMessages.buttonTitle.stake },
  { id: Tab.Unstake, title: commonMessages.buttonTitle.unstake },
  { id: Tab.Balance, title: commonMessages.balance },
]

const boostTabsList = [
  { id: Tab.Stake, title: commonMessages.buttonTitle.stake },
  { id: Tab.Mint, title: commonMessages.buttonTitle.mint },
  { id: Tab.Boost, title: commonMessages.buttonTitle.boost },
  { id: Tab.Balance, title: commonMessages.balance },
]

const unboostTabsList = [
  { id: Tab.Unstake, title: commonMessages.buttonTitle.unstake },
  { id: Tab.Burn, title: commonMessages.buttonTitle.burn },
  { id: Tab.Unboost, title: commonMessages.buttonTitle.unboost },
  { id: Tab.Balance, title: commonMessages.balance },
]

const mintTabsList = boostTabsList.filter(({ id }) => id !== Tab.Boost)

const burnTabsList = unboostTabsList.filter(({ id }) => id !== Tab.Unboost)

export type Input = {
  withMint?: boolean
  withBoost?: boolean
  isReversed?: boolean
}

const getTabsList = ({ withMint, withBoost, isReversed }: Input) => {
  if (withBoost) {
    return isReversed ? unboostTabsList : boostTabsList
  }

  if (withMint) {
    return isReversed ? burnTabsList : mintTabsList
  }

  return baseTabsList
}


export default getTabsList
