import { StakeWiseSDK } from 'sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../../utils/storageNames'


type Position = {
  exitQueueIndex: string
  positionTicket: string
  timestamp: string
}

type ExitRequests = Awaited<ReturnType<StakeWiseSDK['vault']['getExitQueuePositions']>>['requests']

export interface UnstakeQueueState {
  data: {
    total: bigint
    withdrawable: bigint
    duration: number| null
    positions: Position[]
    requests: ExitRequests
  }
  isFetching: boolean
}

export const initialState: UnstakeQueueState = {
  data: {
    total: 0n,
    requests: [],
    positions: [],
    withdrawable: 0n,
    duration: 0,
  },
  isFetching: false,
}

export const unstakeQueueStateSlice = createSlice({
  name: storageNames.vaultUnstakeQueue,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<UnstakeQueueState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<UnstakeQueueState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = unstakeQueueStateSlice.actions

export default unstakeQueueStateSlice.reducer
