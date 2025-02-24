import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../utils/storageNames'


type State = {
  apy: string
  rate: string
  queueDays: number
  feePercent: number
  isFetching: boolean
}

export const initialState: State = {
  apy: '0',
  rate: '0',
  queueDays: 8,
  feePercent: 0,
  isFetching: true,
}

export const mintTokenSlice = createSlice({
  name: storageNames.mintToken,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Partial<State>>) => ({
      ...state,
      ...action.payload,
      isFetching: false,
    }),
  },
})

export const mintTokenMethods = mintTokenSlice.actions

export default mintTokenSlice.reducer
