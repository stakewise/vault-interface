import { useMemo } from 'react'
import { useConfig } from 'config'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { Position } from '../../../util'

import useStakeApy from './useStakeApy'
import useStakeAssets from './useStakeAssets'
import useStakeNetworkCost from './useStakeNetworkCost'


const useOptions = () => {
  const { address } = useConfig()
  const { stake } = stakeCtx.useData()

  const params = {
    getBuyAmount: stake.getBuyAmount,
    isSwapQuoteFetching: stake.isSwapQuoteFetching,
  }

  const stakeApy = useStakeApy(params)
  const stakeAssets = useStakeAssets(params)
  const stakeNetworkCost = useStakeNetworkCost({
    isSwapQuoteFetching: stake.isSwapQuoteFetching,
  })

  return useMemo<Position[]>(() => {
    if (address) {
      return [
        stakeApy,
        stakeAssets,
        stakeNetworkCost,
      ] as Position[]
    }

    return []
  }, [ address, stakeApy, stakeAssets, stakeNetworkCost ])
}


export default useOptions
