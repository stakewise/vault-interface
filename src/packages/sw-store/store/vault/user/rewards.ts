import { StakeWiseSDK } from 'sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../../utils/storageNames'


export interface RewardsState {
  data: Awaited<ReturnType<StakeWiseSDK['vault']['getUserStats']>>
  isFetching: boolean
}

export const initialState: RewardsState = {
  data: {
    apy: [],
    balance: [],
    rewards: [],
  },
  isFetching: true,
}

export const rewardsSlice = createSlice({
  name: storageNames.vaultUserRewards,
  initialState,
  reducers: {
    setData: (_, action: PayloadAction<RewardsState['data']>) => ({
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<RewardsState['isFetching']>) => ({
      ...state,
      isFetching: action.payload,
    }),
    resetData: () => initialState,
  },
})


export const methods = rewardsSlice.actions

export default rewardsSlice.reducer
