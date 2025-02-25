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

export type Input = {
  isEthereum?: boolean
  isReversed?: boolean
}

const getTabsList = ({ isEthereum, isReversed }: Input) => {
  let list = baseTabsList

  if (isEthereum) {
    list = isReversed ? unboostTabsList : boostTabsList
  }
  // TODO filter Mint / Burn

  return list
}


export default getTabsList
