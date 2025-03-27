import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition } from '../../../../util'


const useOptions = () => {
  const { field } = stakeCtx.useData()

  return usePosition({
    type: 'boost',
    field,
  })
}


export default useOptions
