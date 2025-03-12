import getTabsList, { Input } from './getTabsList'


const getTabIds = (values: Input) => {
  const list = getTabsList(values)

  return list.map(({ id }) => id)
}


export default getTabIds
