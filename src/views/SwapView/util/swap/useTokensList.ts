import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { swapTokens, swapTokenTitles, swapTokenCustomUnits, constants } from 'helpers'

import { LogoName } from 'components'


const emptyBalances = {
  6: constants.blockchain.emptyBalance6,
  8: constants.blockchain.emptyBalance8,
  18: constants.blockchain.emptyBalance,
}

const storeSelector = (store: Store) => ({
  fiatRates: store.fiatRates.data,
  swapTokenRates: store.swapTokenRates.data,
  swapTokenBalances: store.account.swapTokenBalances.data,
  nativeTokenBalance: store.account.balances.nativeToken,
  depositTokenBalance: store.account.balances.depositToken,
  isFiatRatesFetching: store.fiatRates.isFetching,
  isSwapTokenRatesFetching: store.swapTokenRates.isFetching,
  isSwapTokenBalancesFetching: store.account.swapTokenBalances.isFetching,
})

const useTokensList = () => {
  const { sdk, chainId, isEthereum, isGnosis } = useConfig()

  const {
    fiatRates,
    swapTokenRates,
    swapTokenBalances,
    nativeTokenBalance,
    depositTokenBalance,
    isFiatRatesFetching,
    isSwapTokenRatesFetching,
    isSwapTokenBalancesFetching,
  } = useStore(storeSelector)

  const rates = useMemo(() => {
    return { ...swapTokenRates, ...fiatRates }
  }, [ swapTokenRates, fiatRates ])

  const isRatesFetching = isSwapTokenRatesFetching || isFiatRatesFetching

  const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

  const initialTokensList = useMemo(() => {
    const result: SwapToken[] = [
      {
        logo: `token/${sdk.config.tokens.depositToken}`,
        name: sdk.config.tokens.depositToken,
        emptyBalance: constants.blockchain.emptyBalance,
        title: isEthereum ? 'Ether' : 'Gnosis',
        balance: depositTokenBalance,
        address: isEthereum ? null : sdk.config.addresses.tokens.depositToken,
        units: 18,
      },
    ]

    if (isGnosis) {
      result.push({
        logo: `token/${sdk.config.tokens.nativeToken}`,
        name: sdk.config.tokens.nativeToken,
        emptyBalance: constants.blockchain.emptyBalance,
        title: sdk.config.tokens.nativeToken,
        balance: nativeTokenBalance,
        address: null,
        units: 18,
      })
    }

    return result
  }, [ sdk, isEthereum, isGnosis, nativeTokenBalance, depositTokenBalance ])

  const swapTokensList = useMemo(() => {
    return Object.keys(chainTokens || {})
      .map((name) => {
        const address = chainTokens[name as keyof typeof chainTokens]
        const balance = swapTokenBalances[name] || 0n

        const logo = `token/${name}` as LogoName
        const title = swapTokenTitles[name as keyof typeof swapTokenTitles]
        const units = swapTokenCustomUnits[name as keyof typeof swapTokenCustomUnits] || 18
        const emptyBalance = emptyBalances[units as keyof typeof emptyBalances]

        return {
          title,
          name,
          logo,
          units,
          address,
          balance,
          emptyBalance,
        }
      })
      .filter(({ name }) => isRatesFetching || rates[name as keyof typeof rates])
      .sort((a, b) => {
        if (a.balance > 0n && b.balance === 0n) {
          return -1
        }

        if (a.balance === 0n && b.balance > 0n) {
          return 1
        }

        return 0
      })
  }, [ chainTokens, rates, swapTokenBalances, isRatesFetching ])

  const isTokensListFetching = isRatesFetching || isSwapTokenBalancesFetching

  return useMemo(() => ({
    list: [ ...initialTokensList, ...swapTokensList ],
    isTokensListFetching,
  }), [
    swapTokensList,
    initialTokensList,
    isTokensListFetching,
  ])
}

useTokensList.mock = {
  list: [],
  isTokensListFetching: false,
} as ReturnType<typeof useTokensList>


export default useTokensList
