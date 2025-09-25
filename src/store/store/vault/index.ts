import { combineReducers } from '@reduxjs/toolkit'

import * as user from './user'
import * as base from './base'
import * as chart from './chart'
import { vaultUserMethods, initialState as vaultUserInitialState } from './user'


export const vaultMethods = {
  base: base.methods,
  chart: chart.methods,
  user: vaultUserMethods,
}

export const initialState = {
  base: base.initialState,
  chart: chart.initialState,
  user: vaultUserInitialState,
}

export default combineReducers({
  user: user.default,
  base: base.default,
  chart: chart.default,
})
