import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StakeWiseSDK } from 'sdk'

import storageNames from '../../../utils/storageNames'


type RewardSplitter = Awaited<ReturnType<StakeWiseSDK['vault']['getRewardSplitters']>>['rewardSplitters'][number]
type ClaimData = Awaited<ReturnType<StakeWiseSDK['rewardSplitter']['getClaimAmount']>>

export interface AllocatorActionsState {
  data: {
    feeRecipients: RewardSplitter['feeRecipients']
    rewardSplitter: RewardSplitter | null
    rewardSplitterAddresses: string[]
    claimer: string | null
  }
  claimData: ClaimData
  isFetching: boolean
}

export const initialState: AllocatorActionsState = {
  data: {
    rewardSplitterAddresses: [],
    rewardSplitter: null,
    feeRecipients: [],
    claimer: null,
  },
  claimData: {
    active: {
      assets: 0n,
      address: '',
    },
    inactive: [],
  },
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
    setClaimData: (state, action: PayloadAction<AllocatorActionsState['claimData']>) => ({
      ...state,
      isFetching: false,
      claimData: action.payload,
    }),
    setFetching: (state, action: PayloadAction<AllocatorActionsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = rewardSplitterSlice.actions

export default rewardSplitterSlice.reducer
