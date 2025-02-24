import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


export interface AccountWalletState {
  isMMI: boolean // MetaMast Institutional
}

export const initialState: AccountWalletState = {
  isMMI: false,
}

export const accountWalletSlice = createSlice({
  name: storageNames.accountWallet,
  initialState,
  reducers: {
    setMMI: (state, action: PayloadAction<AccountWalletState['isMMI']>) => {
      state.isMMI = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = accountWalletSlice.actions

export default accountWalletSlice.reducer
