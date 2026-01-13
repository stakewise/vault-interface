import { combineReducers } from '@reduxjs/toolkit'

import * as rewards from './rewards'
import * as balances from './balances'
import * as unstakeQueue from './unstakeQueue'
import * as unboostQueue from './unboostQueue'


export const vaultUserMethods = {
  rewards: rewards.methods,
  balances: balances.methods,
  unstakeQueue: unstakeQueue.methods,
  unboostQueue: unboostQueue.methods,
}

export const initialState = {
  rewards: rewards.initialState,
  balances: balances.initialState,
  unstakeQueue: unstakeQueue.initialState,
  unboostQueue: unboostQueue.initialState,
}

export default combineReducers({
  rewards: rewards.default,
  balances: balances.default,
  unstakeQueue: unstakeQueue.default,
  unboostQueue: unboostQueue.default,
})
