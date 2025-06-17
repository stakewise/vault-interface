import { useMemo } from 'react'
import { useConfig } from 'config'

import { Position } from '../../../util'

import useStakeApy from './useStakeApy'
import useStakeRate from './useStakeRate'
import useStakeAssets from './useStakeAssets'
import useStakeNetworkCost from './useStakeNetworkCost'


const useOptions = () => {
  const { address } = useConfig()

  const stakeApy = useStakeApy()
  const stakeRate = useStakeRate()
  const stakeAssets = useStakeAssets()
  const stakeNetworkCost = useStakeNetworkCost()

  return useMemo(() => {
    const result: Position[] = [
      stakeApy,
      stakeAssets,
    ]

    if (stakeRate) {
      result.push(stakeRate)
    }

    if (address) {
      result.push(stakeNetworkCost)
    }

    return result
  }, [ address, stakeApy, stakeRate, stakeAssets, stakeNetworkCost ])
}


export default useOptions
