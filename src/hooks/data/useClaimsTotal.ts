import { useMemo } from 'react'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import { formatEther } from 'ethers'

import useStore from './useStore'


const storeSelector = (store: Store) => ({
  fiatRates: store.fiatRates.data,
  currency: store.currency.selected,
  currencySymbol: store.currency.symbol,
  distributorClaims: store.account.distributorClaims.data,
  isFetching: store.account.distributorClaims.isFetching,
})

const useClaimsTotal = () => {
  const { fiatRates, currency, currencySymbol, distributorClaims, isFetching } = useStore(storeSelector)
  const { sdk } = useConfig()

  return useMemo(() => {
    if (!isFetching) {
      const { tokens, unclaimedAmounts } = distributorClaims

      const tokenKeys = Object.keys(sdk.config.addresses.tokens).reduce((acc, tokenKey) => {
        const tokenAddress = sdk.config.addresses.tokens[tokenKey as keyof typeof sdk.config.addresses.tokens]

        acc[tokenAddress] = tokenKey

        return acc
      }, {} as Record<string, string>)

      let amount = 0

      tokens.forEach((tokenAddress, index) => {
        const tokenKey = tokenKeys[tokenAddress]
        const tokenName = sdk.config.tokens[tokenKey as keyof typeof sdk.config.tokens]
        const value = formatEther(unclaimedAmounts[index])

        const fiatValue = methods.getFiatValue({
          token: tokenName,
          value,
          currency,
          fiatRates,
        })

        amount += fiatValue
      })

      if (amount) {
        return methods.formatFiatValue({
          value: amount,
          currencySymbol,
          isMinimal: true,
        })
      }
    }

    return ''
  }, [ sdk, fiatRates, currency, currencySymbol, distributorClaims, isFetching ])
}


export default useClaimsTotal
