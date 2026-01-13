import { createSlice } from '@reduxjs/toolkit'
import * as constants from 'helpers/constants'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../utils/storageNames'


export type TokenSymbol = Exclude<(typeof constants.tokens)[keyof typeof constants.tokens], 'osToken'>

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
  data: Record<TokenSymbol, CurrenciesObject>
  isFetching: boolean
}

export const initialState: FiatRatesState = {
  data: {
    [constants.tokens.gno]: currencies,
    [constants.tokens.eth]: currencies,
    [constants.tokens.ssv]: currencies,
    [constants.tokens.obol]: currencies,
    [constants.tokens.xdai]: currencies,
    [constants.tokens.swise]: currencies,
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
