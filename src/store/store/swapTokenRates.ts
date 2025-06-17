import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../utils/storageNames'
import { CurrenciesObject } from './fiatRates'


export interface SwapTokenRatesState {
  data: Record<string, CurrenciesObject>
  isFetching: boolean
}

export const initialState: SwapTokenRatesState = {
  data: {},
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
  },
})


export const swapTokenRatesMethods = swapTokenRatesSlice.actions

export default swapTokenRatesSlice.reducer
