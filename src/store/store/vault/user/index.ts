import { combineReducers } from '@reduxjs/toolkit'

import * as roles from './roles'
import * as rewards from './rewards'
import * as balances from './balances'
import * as unstakeQueue from './unstakeQueue'
import * as unboostQueue from './unboostQueue'
import * as rewardSplitter from './rewardSplitter'
import * as allocatorActions from './allocatorActions'


export const vaultUserMethods = {
  roles: roles.methods,
  rewards: rewards.methods,
  balances: balances.methods,
  unstakeQueue: unstakeQueue.methods,
  unboostQueue: unboostQueue.methods,
  rewardSplitter: rewardSplitter.methods,
  allocatorActions: allocatorActions.methods,
}

export const initialState = {
  roles: roles.initialState,
  rewards: rewards.initialState,
  balances: balances.initialState,
  unstakeQueue: unstakeQueue.initialState,
  unboostQueue: unboostQueue.initialState,
  rewardSplitter: rewardSplitter.initialState,
  allocatorActions: allocatorActions.initialState,
}

export default combineReducers({
  roles: roles.default,
  rewards: rewards.default,
  balances: balances.default,
  unstakeQueue: unstakeQueue.default,
  unboostQueue: unboostQueue.default,
  rewardSplitter: rewardSplitter.default,
  allocatorActions: allocatorActions.default,
})
