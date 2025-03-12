import { StakeWiseSDK } from 'sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../../utils/storageNames'


type QueuePosition = Awaited<ReturnType<StakeWiseSDK['boost']['getQueuePosition']>>

export interface UnboostQueueState {
  data: QueuePosition
  isFetching: boolean
}

export const initialState: UnboostQueueState = {
  data: {
    duration: null,
    position: null,
    exitingShares: 0n,
    exitingAssets: 0n,
    isClaimable: false,
  },
  isFetching: false,
}

export const unboostQueueStateSlice = createSlice({
  name: storageNames.vaultUnboostQueue,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<UnboostQueueState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<UnboostQueueState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = unboostQueueStateSlice.actions

export default unboostQueueStateSlice.reducer
