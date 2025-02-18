import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { CurrenciesObject } from './fiatRates'
import storageNames from '../utils/storageNames'


const currencySymbols = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'CNY': 'CN¥',
  'JPY': '¥',
  'KRW': '₩',
  'AUD': 'A$',
}

const defaultCurrency = 'USD'

const defaultCurrencySymbol = currencySymbols[defaultCurrency]

type Currencies = keyof CurrenciesObject

export interface CurrencyState {
  selected: Currencies
  symbol: string
  isFetching: boolean
}

export const initialState: CurrencyState = {
  isFetching: true,
  selected: defaultCurrency,
  symbol: defaultCurrencySymbol,
}

export const currencySlice = createSlice({
  name: storageNames.currency,
  initialState,
  reducers: {
    setData: (_, action: PayloadAction<CurrencyState['selected']>) => ({
      isFetching: false,
      selected: action.payload,
      symbol: currencySymbols[action.payload],
    }),
  },
})


export const currencyMethods = currencySlice.actions

export default currencySlice.reducer
