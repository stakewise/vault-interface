import { StakeWiseSDK } from 'apps/v3-sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


type GetVaultData = Awaited<ReturnType<StakeWiseSDK['vault']['getVault']>>

type BaseData = Omit<GetVaultData & {
  versions: Awaited<ReturnType<StakeWiseSDK['getVaultVersion']>>
}, 'version'>

export interface BaseState {
  data: BaseData
  isSSR: boolean
  isFetching: boolean
}

export const initialState: BaseState = {
  data: {
    apy: 0,
    baseApy: 0,
    imageUrl: '',
    createdAt: 0,
    feePercent: 0,
    capacity: '0',
    performance: 0,
    vaultAdmin: '',
    tokenName: '-',
    displayName: '',
    description: '',
    tokenSymbol: '-',
    totalAssets: '0',
    vaultAddress: '',
    mevRecipient: '',
    feeRecipient: '',
    blocklistCount: 0,
    whitelistCount: 0,
    queuedShares: '0',
    depositDataRoot: '',
    whitelistManager: '',
    blocklistManager: '',
    validatorsManager: '',
    depositDataManager: '',
    allocatorMaxBoostApy: 0,
    osTokenHolderMaxBoostApy: 0,

    isErc20: false,
    isPrivate: false,
    isGenesis: false,
    isBlocklist: false,
    isSmoothingPool: false,
    isCollateralized: false,

    osTokenConfig: {
      ltvPercent: '',
      liqThresholdPercent: '',
    },

    versions: {
      isV1Version: false,
      isV2Version: false,
      isMoreV1: false,
      isMoreV2: false,
      version: 1,
    },
  },
  isSSR: false,
  isFetching: true,
}

export const baseSlice = createSlice({
  name: storageNames.vaultBase,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<BaseState['data']>) => ({
      ...state,
      isFetching: false,
      data: action.payload,
    }),
    setFetching: (state, action: PayloadAction<BaseState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => initialState,
  },
})


export const methods = baseSlice.actions

export default baseSlice.reducer
