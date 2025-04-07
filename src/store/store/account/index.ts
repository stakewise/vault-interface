import { combineReducers } from '@reduxjs/toolkit'

import * as wallet from './wallet'
import * as balances from './balances'
import * as vestings from './vestings'
import * as encodings from './encodings'
import * as distributorClaims from './distributorClaims'


export const accountMethods = {  wallet: wallet.methods,
  balances: balances.methods,
  vestings: vestings.methods,
  encodings: encodings.methods,
  distributorClaims: distributorClaims.methods,
}

export const initialState = {  wallet: wallet.initialState,
  balances: balances.initialState,
  vestings: vestings.initialState,
  encodings: encodings.initialState,
  distributorClaims: distributorClaims.initialState,
}

export default combineReducers({  wallet: wallet.default,
  balances: balances.default,
  vestings: vestings.default,
  encodings: encodings.default,
  distributorClaims: distributorClaims.default,
})
