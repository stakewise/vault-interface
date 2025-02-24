import { commonMessages } from 'helpers'
import { Tab } from 'views/HomeView/StakeContext/util'


const baseTabsList = [
  { id: Tab.Stake, title: commonMessages.buttonTitle.stake },
  { id: Tab.Unstake, title: commonMessages.buttonTitle.unstake },
  { id: Tab.Balance, title: commonMessages.balance },
]

const boostTabsList = [
  { id: Tab.Stake, title: commonMessages.buttonTitle.stake },
  { id: Tab.Boost, title: commonMessages.buttonTitle.boost },
  { id: Tab.Balance, title: commonMessages.balance },
]

const unboostTabsList = [
  { id: Tab.Unstake, title: commonMessages.buttonTitle.unstake },
  { id: Tab.Unboost, title: commonMessages.buttonTitle.unboost },
  { id: Tab.Balance, title: commonMessages.balance },
]

export type Input = {
  isEthereum?: boolean
  isReversed?: boolean
}

const getTabsList = ({ isEthereum, isReversed }: Input) => {
  let list = baseTabsList

  if (isEthereum) {
    list = isReversed ? unboostTabsList : boostTabsList
  }

  return list
}


export default getTabsList
