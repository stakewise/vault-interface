import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StakeWiseSDK, OsTokenPositionHealth, BorrowStatus } from 'sdk'

import storageNames from '../../../utils/storageNames'


type MintTokenData = Awaited<ReturnType<StakeWiseSDK['osToken']['getPosition']>>
type BoostData = Omit<
  Awaited<ReturnType<StakeWiseSDK['boost']['getData']>>,
  'vaultApy' | 'maxMintShares' | 'allocatorMaxBoostApy' | 'osTokenHolderMaxBoostApy'
>

export interface BalancesState {
  userAPY: number
  stakedAssets: bigint
  totalEarnedAssets: bigint
  maxWithdrawAssets: bigint
  totalRewardingAssets: bigint
  totalStakeEarnedAssets: bigint
  totalBoostEarnedAssets: bigint
  totalExtraEarnedAssets: bigint
  mintToken: {
    mintedAssets: bigint
    mintedShares: bigint
    maxMintShares: bigint
    hasMintBalance: boolean
    protocolFeePercent: bigint
    healthFactor: MintTokenData['healthFactor']['health']
    isDisabled: boolean | null // UI has two view of fetching
  }
  boost: BoostData
  isFetching: boolean
}

export const initialState: BalancesState = {
  userAPY: 0,
  stakedAssets: 0n,
  totalEarnedAssets: 0n,
  maxWithdrawAssets: 0n,
  totalRewardingAssets: 0n,
  totalStakeEarnedAssets: 0n,
  totalBoostEarnedAssets: 0n,
  totalExtraEarnedAssets: 0n,
  mintToken: {
    mintedAssets: 0n,
    mintedShares: 0n,
    isDisabled: null,
    maxMintShares: 0n,
    hasMintBalance: false,
    protocolFeePercent: 0n,
    healthFactor: OsTokenPositionHealth.Healthy,
  },
  boost: {
    shares: 0n,
    totalShares: 0n,
    rewardAssets: 0n,
    exitingPercent: 0,
    borrowedAssets: 0n,
    borrowStatus: BorrowStatus.Healthy,
    leverageStrategyData: {
      version: 2,
      isUpgradeRequired: false,
    },
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
