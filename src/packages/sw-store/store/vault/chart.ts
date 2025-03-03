import { StakeWiseSDK } from 'apps/v3-sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface ChartState {
  data: Awaited<ReturnType<StakeWiseSDK['vault']['getVaultStats']>>
  isFetching: boolean
}

export const initialState: ChartState = {
  data: [],
  isFetching: true,
}

export const chartSlice = createSlice({
  name: storageNames.vaultChart,
  initialState,
  reducers: {
    setData: (_, action: PayloadAction<ChartState['data']>) => ({
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<ChartState['isFetching']>) => ({
      ...state,
      isFetching: action.payload,
    }),
    resetData: () => initialState,
  },
})


export const methods = chartSlice.actions

export default chartSlice.reducer
