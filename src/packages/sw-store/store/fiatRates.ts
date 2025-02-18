import { createSlice } from '@reduxjs/toolkit'
import * as constants from 'sw-helpers/constants'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../utils/storageNames'


export const currencies = {
  USD: 0,
  EUR: 0,
  GBP: 0,
  CNY: 0,
  JPY: 0,
  KRW: 0,
  AUD: 0,
} as const

export type CurrenciesObject = Record<keyof typeof currencies, number>

export interface FiatRatesState {
  data: {
    [constants.tokens.gno]: CurrenciesObject
    [constants.tokens.eth]: CurrenciesObject
    [constants.tokens.xdai]: CurrenciesObject
    [constants.tokens.swise]: CurrenciesObject
    [constants.tokens.osETH]: CurrenciesObject
    [constants.tokens.osGNO]: CurrenciesObject
    [constants.tokens.sGNO]: CurrenciesObject,
    [constants.tokens.rGNO]: CurrenciesObject,
    [constants.tokens.rETH2]: CurrenciesObject,
    [constants.tokens.sETH2]: CurrenciesObject,
  }
  isFetching: boolean
}

export const initialState: FiatRatesState = {
  data: {
    [constants.tokens.gno]: currencies,
    [constants.tokens.eth]: currencies,
    [constants.tokens.xdai]: currencies,
    [constants.tokens.swise]: currencies,
    [constants.tokens.osETH]: currencies,
    [constants.tokens.osGNO]: currencies,
    [constants.tokens.sGNO]: currencies,
    [constants.tokens.rGNO]: currencies,
    [constants.tokens.rETH2]: currencies,
    [constants.tokens.sETH2]: currencies,
  },
  isFetching: true,
}

export const fiatRatesSlice = createSlice({
  name: storageNames.fiatRates,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Partial<FiatRatesState['data']>>) => {
      state.data = {
        ...state.data,
        ...action.payload,
      }

      state.isFetching = false
    },
  },
})


export const fiatRatesMethods = fiatRatesSlice.actions

export default fiatRatesSlice.reducer
