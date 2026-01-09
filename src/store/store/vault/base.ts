import { StakeWiseSDK } from 'sdk'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import storageNames from '../../utils/storageNames'


type GetVaultData = Awaited<ReturnType<StakeWiseSDK['vault']['getVault']>>

type BaseData = Omit<GetVaultData, 'version'> & {
  isPostPectra: boolean
  avgQueueDays: number
  protocolFeePercent: string
  versions: Awaited<ReturnType<StakeWiseSDK['vault']['getVaultVersion']>>
}

export interface BaseState {
  data: BaseData
  isSSR: boolean
  isFetching: boolean
}

// ATTN Do not use bigint values in this storage, as we fill it on SSR and any bigints are modified to strings there.

export const initialState: BaseState = {
  data: {
    apy: 0,
    baseApy: 0,
    imageUrl: '',
    createdAt: 0,
    feePercent: 0,
    capacity: '0',
    performance: 0,
    avgQueueDays: 0,
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
    lastFeePercent: 0,
    queuedShares: '0',
    depositDataRoot: '',
    whitelistManager: '',
    blocklistManager: '',
    validatorsManager: '',
    depositDataManager: '',
    protocolFeePercent: '0',
    allocatorMaxBoostApy: 0,
    lastFeeUpdateTimestamp: '0',

    isErc20: false,
    isPrivate: false,
    isGenesis: false,
    isMetaVault: false,
    isBlocklist: false,
    isPostPectra: false,
    isSmoothingPool: false,
    isCollateralized: false,

    osTokenConfig: {
      ltvPercent: '0',
      liqThresholdPercent: '0',
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
    resetSSR: (state) => {
      state.isSSR = false
    },
    resetData: () => initialState,
  },
})


export const methods = baseSlice.actions

export default baseSlice.reducer
