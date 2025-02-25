import getTabsList, { Input } from './getTabsList'


const getTabIds = ({ isEthereum, isReversed }: Input) => {
  const list = getTabsList({ isEthereum, isReversed })

  return list.map(({ id }) => id)
}


export default getTabIds
