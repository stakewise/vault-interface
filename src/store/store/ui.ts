import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import messages from '../messages'
import storageNames from '../utils/storageNames'


export interface UiState {
  isNewReleaseAvailable: boolean
  bottomLoader: {
    content: Intl.Message | string
    link?: string
  } | null
}

export const initialState: UiState = {
  isNewReleaseAvailable: false,
  bottomLoader: null,
}

export const loadersSlice = createSlice({
  name: storageNames.ui,
  initialState,
  reducers: {
    setNewReleaseAvailable: (state, action: PayloadAction<boolean>) => {
      state.isNewReleaseAvailable = action.payload
    },
    setBottomLoader: (state, action: PayloadAction<UiState['bottomLoader']>) => {
      state.bottomLoader = action.payload
    },
    setBottomLoaderTransaction: (state, action: PayloadAction<string>) => {
      state.bottomLoader = {
        link: action.payload,
        content: messages.processingTransaction,
      }
    },
    resetBottomLoader: (state) => {
      state.bottomLoader = null
    },
  },
})


export const uiMethods = loadersSlice.actions

export default loadersSlice.reducer
