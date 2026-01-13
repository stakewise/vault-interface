import { combineReducers } from '@reduxjs/toolkit'

import * as balances from './balances'
import * as vestings from './vestings'
import * as distributorClaims from './distributorClaims'
import * as swapTokenBalances from './swapTokenBalances'


export const accountMethods = {  balances: balances.methods,
  vestings: vestings.methods,
  distributorClaims: distributorClaims.methods,
  swapTokenBalances: swapTokenBalances.methods,
}

export const initialState = {  balances: balances.initialState,
  vestings: vestings.initialState,
  distributorClaims: distributorClaims.initialState,
  swapTokenBalances: swapTokenBalances.initialState,
}

export default combineReducers({  balances: balances.default,
  vestings: vestings.default,
  distributorClaims: distributorClaims.default,
  swapTokenBalances: swapTokenBalances.default,
})
