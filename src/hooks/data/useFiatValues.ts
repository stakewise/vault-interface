import { methods } from 'helpers'
import { useMemo, useCallback } from 'react'
import { createSelector } from '@reduxjs/toolkit'

import useStore from '../data/useStore'


type Input<T extends string> = Record<T, {
  token: keyof Store['fiatRates']['data']
  isMinimal?: boolean
  value: string
}>

type Output<T extends string> = Record<T, {
  value: number
  formattedValue: string
}>

const storeSelector = createSelector([
  (store: Store) => store.currency.symbol,
  (store: Store) => store.currency.selected,
  (store: Store) => store.fiatRates.isFetching,
  (store: Store) => store.fiatRates.data,
  (store: Store) => store.swapTokenRates.data,
], (currencySymbol, currency, isFetching, fiatRates, swapTokenRates) => ({
  swapTokenRates,
  currencySymbol,
  isFetching,
  fiatRates,
  currency,
}))

const mock = {
  value: 0,
  formattedValue: '0.00',
}

const useFiatValues = <T extends string>(values: Input<T>): Output<T> => {
  const { fiatRates, swapTokenRates, currency, currencySymbol, isFetching } = useStore(storeSelector)

  const getFiatValue = useCallback((params: Input<T>[T]) => {
    const { token, value, isMinimal } = params

    if (isFetching) {
      return mock
    }

    const allRates = { ...fiatRates, ...swapTokenRates }

    const isValidToken = Object.keys(allRates).includes(token)

    if (!isValidToken) {
      console.error(`Incorrect token value in getFiatValue: ${token}`)
      return mock
    }

    const fiatValue = methods.getFiatValue({
      value,
      token,
      currency,
      fiatRates: allRates,
      isMinimal,
    })

    const formattedValue = methods.formatFiatValue({
      value: fiatValue,
      currencySymbol,
      isMinimal,
    })

    return {
      value: fiatValue,
      formattedValue,
    }
  }, [ fiatRates, swapTokenRates, currency, currencySymbol, isFetching ])

  return useMemo(() => (
    Object.keys(values).reduce<Output<T>>((acc, key) => {
      const params = values[key as keyof typeof values]
      const result = getFiatValue(params)

      acc[key as keyof typeof values] = result

      return acc
    }, {} as Output<T>)
  ), [ values, getFiatValue ])
}


export default useFiatValues
