import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface VestingsState {
  data: Array<{
    total: bigint
    vested: bigint
    claimed: bigint
    endTime: number
    startTime: number
    available: bigint
    isClaimed: boolean
    beneficiary: string
    contractAddress: string
  }>
  isFetching: boolean
}

export const initialState: VestingsState = {
  data: [],
  isFetching: true,
}

export const vestingsSlice = createSlice({
  name: storageNames.vestings,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<VestingsState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<VestingsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = vestingsSlice.actions

export default vestingsSlice.reducer
