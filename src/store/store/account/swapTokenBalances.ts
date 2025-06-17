import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface SwapTokenBalancesState {
  data: Record<string, bigint>,
  isFetching: boolean
}

export const initialState: SwapTokenBalancesState = {
  data: {},
  isFetching: true,
}

export const swapTokenBalancesSlice = createSlice({
  name: storageNames.swapTokenBalances,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<SwapTokenBalancesState['data']>) => {
      state.data = action.payload
      state.isFetching = false
    },
    setFetching: (state, action: PayloadAction<SwapTokenBalancesState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => ({
      ...initialState,
      isFetching: false,
    }),
  },
})


export const methods = swapTokenBalancesSlice.actions

export default swapTokenBalancesSlice.reducer
