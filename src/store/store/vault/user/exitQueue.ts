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

export interface ExitQueueState {
  data: {
    total: bigint
    withdrawable: bigint
    duration: number| null
    positions: Position[]
    requests: ExitRequests
  }
  isFetching: boolean
}

export const initialState: ExitQueueState = {
  data: {
    total: 0n,
    requests: [],
    positions: [],
    withdrawable: 0n,
    duration: 0,
  },
  isFetching: false,
}

export const exitQueueStateSlice = createSlice({
  name: storageNames.vaultExitQueue,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<ExitQueueState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<ExitQueueState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = exitQueueStateSlice.actions

export default exitQueueStateSlice.reducer
