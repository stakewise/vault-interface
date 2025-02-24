import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface BalancesState {
  data: {
    mintTokenBalance: bigint
    swiseTokenBalance: bigint
    nativeTokenBalance: bigint
    depositTokenBalance: bigint
    v2StakeTokenBalance: bigint
    v2RewardTokenBalance: bigint
  }
  isFetching: boolean
}

export const initialState: BalancesState = {
  data: {
    depositTokenBalance: 0n,
    nativeTokenBalance: 0n,
    swiseTokenBalance: 0n,
    mintTokenBalance: 0n,
    v2StakeTokenBalance: 0n,
    v2RewardTokenBalance: 0n,
  },
  isFetching: true,
}

export const balancesSlice = createSlice({
  name: storageNames.accountBalances,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<BalancesState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<BalancesState['isFetching']>) => {
      state.isFetching = action.payload
    },
    setSwiseTokenBalance: (state, action: PayloadAction<BalancesState['data']['swiseTokenBalance']>) => {
      state.data.swiseTokenBalance = action.payload
    },
    setNativeTokenBalance: (state, action: PayloadAction<BalancesState['data']['nativeTokenBalance']>) => {
      state.data.nativeTokenBalance = action.payload
    },
    setDepositTokenBalance: (state, action: PayloadAction<BalancesState['data']['nativeTokenBalance']>) => {
      state.data.depositTokenBalance = action.payload
    },
    setMintTokenBalance: (state, action: PayloadAction<BalancesState['data']['mintTokenBalance']>) => {
      state.data.mintTokenBalance = action.payload
    },
    setV2StakeTokenBalance: (state, action: PayloadAction<BalancesState['data']['v2StakeTokenBalance']>) => {
      state.data.v2StakeTokenBalance = action.payload
    },
    setV2RewardTokenBalance: (state, action: PayloadAction<BalancesState['data']['v2RewardTokenBalance']>) => {
      state.data.v2RewardTokenBalance = action.payload
    },
    resetData: () => ({
      ...initialState,
      isFetching: false,
    }),
  },
})


export const methods = balancesSlice.actions

export default balancesSlice.reducer
