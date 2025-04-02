import { StakeWiseSDK, AllocatorActionType } from 'sdk'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { formatEther } from 'ethers'
import swMethods from 'helpers/methods'

import storageNames from '../../../utils/storageNames'


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

type FirstItemPayload = {
  hash: string,
  link: string,
  shares?: bigint,
  assets?: bigint,
  actionType: AllocatorActionType,
}

export const allocatorActionsSlice = createSlice({
  name: storageNames.vaultUserActions,
  initialState,
  reducers: {
    addFirstItem: (state, action: PayloadAction<FirstItemPayload>) => {
      const { hash, actionType, assets, shares, link } = action.payload

      const firstAction: AllocatorActionsState['data'][0] = {
        id: hash,
        actionType,
        createdAt: Date.now(),
        shares: shares ? formatEther(shares) : '0',
        assets: assets ? formatEther(assets) : '0',
        link: `${link}/tx/${hash.replace(/-.*/, '')}`,
      }

      const newItems = [
        firstAction,
        ...state.data,
      ]

      const updatedActionsArray = swMethods.getArrUniqueItems(newItems, 'id')

      return {
        ...state,
        isFetching: false,
        data: updatedActionsArray,
      }
    },
    addItem: (state, action: PayloadAction<AllocatorActionsState['data']>) => {
      const newActions = action.payload
      const newItems = [
        ...state.data,
        ...newActions,
      ]

      const updatedActionsArray = swMethods.getArrUniqueItems(newItems, 'id')

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
