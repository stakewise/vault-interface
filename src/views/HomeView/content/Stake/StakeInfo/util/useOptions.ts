import { useMemo } from 'react'
import { useConfig } from 'config'
import { useSwapQuote } from 'hooks'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { Position } from '../../../util'

import useStakeApy from './useStakeApy'
import useStakeAssets from './useStakeAssets'
import useStakeNetworkCost from './useStakeNetworkCost'


const useOptions = () => {
  const { address } = useConfig()
  const { stake } = stakeCtx.useData()

  const swapToken = stake.swapTokens.selected

  const { isFetching: isSwapQuoteFetching, getBuyAmount } = useSwapQuote({
    amount: swapToken.balance,
    fromToken: swapToken.address,
  })

  const params = {
    getBuyAmount,
    isSwapQuoteFetching,
  }

  const stakeApy = useStakeApy(params)
  const stakeAssets = useStakeAssets(params)
  const stakeNetworkCost = useStakeNetworkCost({
    isSwapQuoteFetching,
  })

  return useMemo<Position[]>(() => {
    if (address) {
      return [
        stakeApy,
        stakeAssets,
        stakeNetworkCost,
      ]
    }

    return []
  }, [ address, stakeApy, stakeAssets, stakeNetworkCost ])
}


export default useOptions
