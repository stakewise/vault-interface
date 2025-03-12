import swMethods from 'sw-methods'
import { StakeWiseSDK } from 'apps/v3-sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface ValidatorsState {
  data: Awaited<ReturnType<StakeWiseSDK['vault']['getValidators']>>
  isFetching: boolean
  isLoadMore: boolean
}

export const initialState: ValidatorsState = {
  data: [],
  isFetching: true,
  isLoadMore: true,
}

export const validatorsSlice = createSlice({
  name: storageNames.vaultValidators,
  initialState,
  reducers: {
    addItems: (state, action: PayloadAction<ValidatorsState['data']>) => {
      const newValidators = action.payload
      const newItems = [
        ...state.data,
        ...newValidators,
      ]

      const updatedValidatorsArray = swMethods.getArrUniqueItems(newItems, 'publicKey')

      return {
        ...state,
        isFetching: false,
        data: updatedValidatorsArray,
      }
    },
    setFetching: (state, action: PayloadAction<ValidatorsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    setLoadMore: (state, action: PayloadAction<ValidatorsState['isLoadMore']>) => {
      state.isLoadMore = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = validatorsSlice.actions

export default validatorsSlice.reducer
