import { useCallback } from 'react'
import { createErc20Contract } from 'sdk'
import { swapTokens } from 'helpers'
import { useConfig } from 'config'


type ModifyResultInput = {
  values: bigint[]
  chainTokens: Record<string, string>
}

const modifyResult = ({ values, chainTokens }: ModifyResultInput) => {
  const result: Record<string, bigint> = {}
  const tokenNames = Object.keys(chainTokens)

  values.forEach((value, index) => {
    const token = tokenNames[index]

    result[token] = value
  })

  return result
}

const useSwapTokenBalances = () => {
  const { chainId, address, readOnlyProvider } = useConfig()

  const fetchSwapTokenBalance = useCallback(async (tokenAddress: string) => {
    if (!address) {
      return 0n
    }

    try {
      const tokenContract = createErc20Contract(tokenAddress, readOnlyProvider)

      const balance = await tokenContract.balanceOf(address)

      return balance
    }
    catch {
      console.error('Failed to fetch balance', tokenAddress)

      return 0n
    }
  }, [ address, readOnlyProvider ])

  return useCallback(async (tokens?: Record<string, string>) => {
    const chainTokens = tokens || swapTokens[chainId as keyof typeof swapTokens]

    if (!chainTokens) {
      return {}
    }

    const values = await Promise.all(
      Object.values(chainTokens).map((tokenAddress) => (
        fetchSwapTokenBalance(tokenAddress)
      ))
    )

    return modifyResult({ values, chainTokens })
  }, [ chainId, fetchSwapTokenBalance ])
}


export default useSwapTokenBalances
