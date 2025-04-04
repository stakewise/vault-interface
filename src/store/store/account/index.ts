import { combineReducers } from '@reduxjs/toolkit'

import * as email from './email'
import * as wallet from './wallet'
import * as balances from './balances'
import * as vestings from './vestings'
import * as encodings from './encodings'
import * as distributorClaims from './distributorClaims'


export const accountMethods = {
  email: email.methods,
  wallet: wallet.methods,
  balances: balances.methods,
  vestings: vestings.methods,
  encodings: encodings.methods,
  distributorClaims: distributorClaims.methods,
}

export const initialState = {
  email: email.initialState,
  wallet: wallet.initialState,
  balances: balances.initialState,
  vestings: vestings.initialState,
  encodings: encodings.initialState,
  distributorClaims: distributorClaims.initialState,
}

export default combineReducers({
  email: email.default,
  wallet: wallet.default,
  balances: balances.default,
  vestings: vestings.default,
  encodings: encodings.default,
  distributorClaims: distributorClaims.default,
})
