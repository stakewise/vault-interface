import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface DistributorClaimsState {
  data: {
    proof: string[]
    tokens: string[]
    unclaimedAmounts: string[]
    cumulativeAmounts: string[]
  }
  isFetching: boolean
}

export const initialState: DistributorClaimsState = {
  data: {
    proof: [],
    tokens: [],
    unclaimedAmounts: [],
    cumulativeAmounts: [],
  },
  isFetching: true,
}

export const distributorClaimsSlice = createSlice({
  name: storageNames.distributorClaims,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Partial<DistributorClaimsState['data']>>) => ({
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        ...action.payload,
      },
    }),
    setFetching: (state, action: PayloadAction<DistributorClaimsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = distributorClaimsSlice.actions

export default distributorClaimsSlice.reducer
