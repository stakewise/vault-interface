import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface EmailState {
  email: string
  isFetching: boolean
}

export const initialState: EmailState = {
  email: '',
  isFetching: true,
}

export const emailSlice = createSlice({
  name: storageNames.email,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Partial<EmailState['email']>>) => ({
      ...state,
      email: action.payload,
      isFetching: false,
    }),
    setFetching: (state, action: PayloadAction<EmailState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = emailSlice.actions

export default emailSlice.reducer
