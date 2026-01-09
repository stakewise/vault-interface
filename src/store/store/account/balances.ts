import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface BalancesState {
  mintToken: bigint
  swiseToken: bigint
  nativeToken: bigint
  depositToken: bigint
  v2StakeToken: bigint
  v2RewardToken: bigint
  isFetching: boolean
}

export const initialState: BalancesState = {
  mintToken: 0n,
  swiseToken: 0n,
  nativeToken: 0n,
  depositToken: 0n,
  v2StakeToken: 0n,
  v2RewardToken: 0n,
  isFetching: true,
}

export const balancesSlice = createSlice({
  name: storageNames.accountBalances,
  initialState,
  reducers: {
    setMintToken: (state, action: PayloadAction<BalancesState['mintToken']>) => {
      state.mintToken = action.payload
    },
    setSwiseToken: (state, action: PayloadAction<BalancesState['swiseToken']>) => {
      state.swiseToken = action.payload
    },
    setNativeToken: (state, action: PayloadAction<BalancesState['nativeToken']>) => {
      state.nativeToken = action.payload
    },
    setDepositToken: (state, action: PayloadAction<BalancesState['nativeToken']>) => {
      state.depositToken = action.payload
    },
    setV2StakeToken: (state, action: PayloadAction<BalancesState['v2StakeToken']>) => {
      state.v2StakeToken = action.payload
    },
    setV2RewardToken: (state, action: PayloadAction<BalancesState['v2RewardToken']>) => {
      state.v2RewardToken = action.payload
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
