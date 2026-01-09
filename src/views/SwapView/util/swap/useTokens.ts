import { useCallback, useMemo } from 'react'
import { useConfig } from 'config'

import useToken from './useToken'
import useTokensList from './useTokensList'


type InitialToken = string | null

type SetTokensInput = {
  buyToken?: InitialToken
  sellToken?: InitialToken
}

type Input = {
  initialBuyToken?: InitialToken
  initialSellToken?: InitialToken
}

const useTokens = (values?: Input) => {
  const { initialBuyToken, initialSellToken } = values || {}

  const { sdk } = useConfig()
  const { list, isTokensListFetching } = useTokensList()

  const buyToken = useToken({
    list,
    initialToken: typeof initialBuyToken !== 'undefined' ? initialBuyToken : sdk.config.addresses.tokens.depositToken,
  })

  const sellToken = useToken({
    list,
    initialToken: initialSellToken || null,
  })

  const filteredList = useMemo(() => (
    list.filter(({ address }) => (
      ![ buyToken.data.address, sellToken.data.address ].includes(address)
    ))
  ), [ buyToken, sellToken, list ])

  const setTokens = useCallback((values: SetTokensInput) => {
    if (values.buyToken || values.buyToken === null) {
      buyToken.set(values.buyToken)
    }
    if (values.sellToken || values.sellToken === null) {
      sellToken.set(values.sellToken)
    }
  }, [ buyToken, sellToken ])

  const resetTokens = useCallback(() => {
    buyToken.reset()
    sellToken.reset()
  }, [ buyToken, sellToken ])

  return useMemo(() => ({
    list: filteredList,
    buyToken: buyToken.data,
    sellToken: sellToken.data,
    isFetching: isTokensListFetching,
    set: setTokens,
    reset: resetTokens,
  }), [
    buyToken,
    sellToken,
    filteredList,
    isTokensListFetching,
    setTokens,
    resetTokens,
  ])
}

useTokens.mock = {
  list: [],
  buyToken: useToken.mock.data,
  sellToken: useToken.mock.data,
  isFetching: false,
  set: () => {},
  reset: () => {},
} as ReturnType<typeof useTokens>


export default useTokens
