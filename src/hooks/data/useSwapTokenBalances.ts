import { useCallback } from 'react'
import { useConfig } from 'config'
import { swapTokens } from 'helpers'


type Input = {
  values: bigint[]
  chainTokens: Record<string, string>
}

const modifyResult = ({ values, chainTokens }: Input) => {
  const result: Record<string, bigint> = {}
  const tokenNames = Object.keys(chainTokens)

  values.forEach((value, index) => {
    const token = tokenNames[index]

    result[token] = value
  })

  return result
}

const useSwapTokenBalances = () => {
  const { sdk, chainId, address } = useConfig()

  const fetchSwapTokenBalance = useCallback(async (tokenAddress: string) => {
    if (!address) {
      return 0n
    }

    try {
      const tokenContract = sdk.contracts.helpers.createErc20(tokenAddress)
      const balance = await tokenContract.balanceOf(address)

      return balance
    }
    catch {
      console.error('Failed to fetch balance', tokenAddress)

      return 0n
    }
  }, [ sdk, address ])

  return useCallback(async () => {
    const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

    if (!chainTokens) {
      return {}
    }

    const values = await Promise.all(
      Object.values(chainTokens).map((tokenAddress) => fetchSwapTokenBalance(tokenAddress))
    )

    return modifyResult({ values, chainTokens })
  }, [ chainId, fetchSwapTokenBalance ])
}


export default useSwapTokenBalances
