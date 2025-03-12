import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StakeWiseSDK, OsTokenPositionHealth, BorrowStatus } from 'apps/v3-sdk'

import storageNames from '../../../utils/storageNames'


type MintTokenData = Awaited<ReturnType<StakeWiseSDK['osToken']['getPosition']>>
type BoostData = Awaited<ReturnType<StakeWiseSDK['boost']['getData']>>

export interface BalancesState {
  userAPY: number
  withdraw: {
    maxAssets: bigint
  }
  stake: {
    assets: bigint
  },
  mintToken: MintTokenData & {
    maxMintShares: bigint
    hasMintBalance: boolean
    isDisabled: boolean | null // UI has two view of fetching
  }
  boost: BoostData
  isFetching: boolean
}

export const initialState: BalancesState = {
  userAPY: 0,
  withdraw: {
    maxAssets: 0n,
  },
  stake: {
    assets: 0n,
  },
  mintToken: {
    isDisabled: null,
    maxMintShares: 0n,
    hasMintBalance: false,
    protocolFeePercent: 0n,
    minted: {
      assets: 0n,
      shares: 0n,
    },
    healthFactor: {
      health: OsTokenPositionHealth.Healthy,
      value: 0,
    },
  },
  boost: {
    shares: 0n,
    vaultApy: 0,
    totalShares: 0n,
    rewardAssets: 0n,
    maxMintShares: 0n,
    exitingPercent: 0,
    borrowedAssets: 0n,
    allocatorMaxBoostApy: 0,
    osTokenHolderMaxBoostApy: 0,
    borrowStatus: BorrowStatus.Healthy,
  },
  isFetching: true,
}

export const balancesSlice = createSlice({
  name: storageNames.vaultBalances,
  initialState,
  reducers: {
    setData: (_, action: PayloadAction<Omit<BalancesState, 'isFetching'>>) => ({
      ...action.payload,
      isFetching: false,
    }),
    setFetching: (state, action: PayloadAction<BalancesState['isFetching']>) => {
      state.isFetching = action.payload
    },
    resetData: () => ({
      ...initialState,
      isFetching: false,
    }),
  },
})


export const methods = balancesSlice.actions

export default balancesSlice.reducer
