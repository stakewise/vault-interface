import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../../utils/storageNames'


export interface RolesState {
  data: {
    isVaultAdmin: boolean
    isWhitelisted: boolean
    isBlocklisted: boolean
    isWhitelistManager: boolean
    isBlocklistManager: boolean
    isDepositDataManager: boolean
    isNativeValidatorsManager: boolean
  }
  isFetching: boolean
}

export const initialState: RolesState = {
  data: {
    isVaultAdmin: false,
    isWhitelisted: true,
    isBlocklisted: false,
    isWhitelistManager: false,
    isBlocklistManager: false,
    isDepositDataManager: false,
    isNativeValidatorsManager: true,
  },
  isFetching: true,
}

export const rolesSlice = createSlice({
  name: storageNames.vaultRoles,
  initialState,
  reducers: {
    setData: (_, action: PayloadAction<RolesState['data']>) => ({
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<RolesState['isFetching']>) => ({
      ...state,
      isFetching: action.payload,
    }),
    resetData: (_, action: PayloadAction<RolesState['isFetching']>) => ({
      ...initialState,
      isFetching: action.payload,
    }),
  },
})


export const methods = rolesSlice.actions

export default rolesSlice.reducer
