import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface BalancesState {
  mintToken: bigint
  nativeToken: bigint
  depositToken: bigint
  isFetching: boolean
}

export const initialState: BalancesState = {
  mintToken: 0n,
  nativeToken: 0n,
  depositToken: 0n,
  isFetching: true,
}

export const balancesSlice = createSlice({
  name: storageNames.accountBalances,
  initialState,
  reducers: {
    setMintToken: (state, action: PayloadAction<BalancesState['mintToken']>) => {
      state.mintToken = action.payload
    },
    setNativeToken: (state, action: PayloadAction<BalancesState['nativeToken']>) => {
      state.nativeToken = action.payload
    },
    setDepositToken: (state, action: PayloadAction<BalancesState['nativeToken']>) => {
      state.depositToken = action.payload
    },
    setFetching: (state, action: PayloadAction<BalancesState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => ({
      ...initialState,
      isFetching: false,
    }),
  },
})


export const methods = balancesSlice.actions

export default balancesSlice.reducer
