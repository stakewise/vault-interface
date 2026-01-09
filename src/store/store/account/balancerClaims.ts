import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface BalancerClaimsState {
  data: {
    index: number
    proof: string[]
    amount: string
  }
  isFetching: boolean
}

export const initialState: BalancerClaimsState = {
  data: {
    index: 0,
    proof: [],
    amount: '',
  },
  isFetching: true,
}

export const balancerClaimsSlice = createSlice({
  name: storageNames.balancerClaims,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<BalancerClaimsState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<BalancerClaimsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = balancerClaimsSlice.actions

export default balancerClaimsSlice.reducer
