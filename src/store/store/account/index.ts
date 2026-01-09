import { combineReducers } from '@reduxjs/toolkit'

import * as balances from './balances'
import * as vestings from './vestings'
import * as encodings from './encodings'
import * as balancerClaims from './balancerClaims'
import * as distributorClaims from './distributorClaims'
import * as swapTokenBalances from './swapTokenBalances'


export const accountMethods = {  balances: balances.methods,
  vestings: vestings.methods,
  encodings: encodings.methods,
  balancerClaims: balancerClaims.methods,
  distributorClaims: distributorClaims.methods,
  swapTokenBalances: swapTokenBalances.methods,
}

export const initialState = {  balances: balances.initialState,
  vestings: vestings.initialState,
  encodings: encodings.initialState,
  balancerClaims: balancerClaims.initialState,
  distributorClaims: distributorClaims.initialState,
  swapTokenBalances: swapTokenBalances.initialState,
}

export default combineReducers({  balances: balances.default,
  vestings: vestings.default,
  encodings: encodings.default,
  balancerClaims: balancerClaims.default,
  distributorClaims: distributorClaims.default,
  swapTokenBalances: swapTokenBalances.default,
})
