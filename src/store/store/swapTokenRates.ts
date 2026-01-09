import { createSlice } from '@reduxjs/toolkit'
import * as constants from 'helpers/constants'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../utils/storageNames'
import { currencies } from './fiatRates'
import type { CurrenciesObject } from './fiatRates'


export interface SwapTokenRatesState {
  data: Record<string, CurrenciesObject>
  isFetching: boolean
}

export const initialState: SwapTokenRatesState = {
  data: {
    [constants.tokens.gno]: currencies,
    [constants.tokens.eth]: currencies,
    [constants.tokens.ssv]: currencies,
    [constants.tokens.obol]: currencies,
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

export const swapTokenRatesSlice = createSlice({
  name: storageNames.swapTokenRates,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<SwapTokenRatesState['data']>) => {
      state.data = action.payload
      state.isFetching = false
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const swapTokenRatesMethods = swapTokenRatesSlice.actions

export default swapTokenRatesSlice.reducer
