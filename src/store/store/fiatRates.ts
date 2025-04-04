import { createSlice } from '@reduxjs/toolkit'
import * as constants from 'helpers/constants'
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
    [constants.tokens.osETH]: CurrenciesObject
    [constants.tokens.osGNO]: CurrenciesObject
  }
  isFetching: boolean
}

export const initialState: FiatRatesState = {
  data: {
    [constants.tokens.gno]: currencies,
    [constants.tokens.eth]: currencies,
    [constants.tokens.xdai]: currencies,
    [constants.tokens.osETH]: currencies,
    [constants.tokens.osGNO]: currencies,
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
