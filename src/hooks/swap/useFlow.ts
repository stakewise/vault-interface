import { useMemo } from 'react'
import { Network } from 'sdk'
import { useConfig } from 'config'
import { swapTokens as swapTokenAddresses } from 'helpers'

import useTokens from './useTokens'


type Input = {
  swapTokens: ReturnType<typeof useTokens>
}

type GetFlowInput = Input & {
  isEthereum: boolean
}

export const getFlow = ({ swapTokens, isEthereum }: GetFlowInput) => {
  const wrappedTokenAddress = isEthereum
    ? swapTokenAddresses[Network.Mainnet].WETH
    : swapTokenAddresses[Network.Gnosis].wxDAI

  const isWrapFlow = (
    !swapTokens.sellToken.address
    && swapTokens.buyToken.address === wrappedTokenAddress
  )

  const isUnwrapFlow = (
    swapTokens.sellToken.address === wrappedTokenAddress
    && !swapTokens.buyToken.address
  )

  return isWrapFlow || isUnwrapFlow
}

const useFlow = ({ swapTokens }: Input) => {
  const { isEthereum } = useConfig()

  return useMemo(() => {
    return getFlow({ swapTokens, isEthereum })
  }, [
    swapTokens,
    isEthereum,
  ])
}


export default useFlow
