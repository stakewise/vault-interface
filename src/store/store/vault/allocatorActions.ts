import { StakeWiseSDK } from 'sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import getArrUniqueItems from 'helpers/methods/getArrUniqueItems'

import storageNames from '../../utils/storageNames'


export interface AllocatorActionsState {
  data: Awaited<ReturnType<StakeWiseSDK['vault']['getStakerActions']>>
  isFetching: boolean
  isLoadMore: boolean
}

export const initialState: AllocatorActionsState = {
  data: [],
  isFetching: true,
  isLoadMore: true,
}

export const allocatorActionsSlice = createSlice({
  name: storageNames.allocatorActions,
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AllocatorActionsState['data']>) => {
      const newActions = action.payload
      const newItems = [
        ...state.data,
        ...newActions,
      ]

      const updatedActionsArray = getArrUniqueItems(newItems, 'id')

      return {
        ...state,
        isFetching: false,
        data: updatedActionsArray,
      }
    },
    setFetching: (state, action: PayloadAction<AllocatorActionsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    setLoadMore: (state, action: PayloadAction<AllocatorActionsState['isLoadMore']>) => {
      state.isLoadMore = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = allocatorActionsSlice.actions

export default allocatorActionsSlice.reducer
