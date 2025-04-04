import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../../utils/storageNames'


type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

type RewardSplitter = {
  owner: string
  address: string
  totalShares: bigint
  feeRecipients: FeeRecipient[]
}

export interface AllocatorActionsState {
  data: {
    feeRecipients: FeeRecipient[]
    rewardSplitter: RewardSplitter | null
    rewardSplitterAddresses: string[]
  }
  claimAmount: bigint
  isFetching: boolean
}

export const initialState: AllocatorActionsState = {
  data: {
    rewardSplitterAddresses: [],
    rewardSplitter: null,
    feeRecipients: [],
  },
  claimAmount: 0n,
  isFetching: true,
}

export const rewardSplitterSlice = createSlice({
  name: storageNames.rewardSplitter,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<AllocatorActionsState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setClaimAmount: (state, action: PayloadAction<AllocatorActionsState['claimAmount']>) => ({
      ...state,
      isFetching: false,
      claimAmount: action.payload,
    }),
    setFetching: (state, action: PayloadAction<AllocatorActionsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = rewardSplitterSlice.actions

export default rewardSplitterSlice.reducer
