import { combineReducers } from '@reduxjs/toolkit'

import * as wallet from './wallet'
import * as balances from './balances'
import * as vestings from './vestings'
import * as encodings from './encodings'
import * as distributorClaims from './distributorClaims'
import * as swapTokenBalances from './swapTokenBalances'


export const accountMethods = {  wallet: wallet.methods,
  balances: balances.methods,
  vestings: vestings.methods,
  encodings: encodings.methods,
  distributorClaims: distributorClaims.methods,
  swapTokenBalances: swapTokenBalances.methods,
}

export const initialState = {  wallet: wallet.initialState,
  balances: balances.initialState,
  vestings: vestings.initialState,
  encodings: encodings.initialState,
  distributorClaims: distributorClaims.initialState,
  swapTokenBalances: swapTokenBalances.initialState,
}

export default combineReducers({  wallet: wallet.default,
  balances: balances.default,
  vestings: vestings.default,
  encodings: encodings.default,
  distributorClaims: distributorClaims.default,
  swapTokenBalances: swapTokenBalances.default,
})
