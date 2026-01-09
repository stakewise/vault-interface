import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface EncodingsState {
  data: {
    address: string | null
    referralQuery: string | null
  }
  isFetching: boolean
}

export const initialState: EncodingsState = {
  data: {
    address: null,
    referralQuery: null,
  },
  isFetching: true,
}

export const encodingsSlice = createSlice({
  name: storageNames.encodings,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<EncodingsState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<EncodingsState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = encodingsSlice.actions

export default encodingsSlice.reducer
