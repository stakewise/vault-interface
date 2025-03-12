import { combineReducers } from '@reduxjs/toolkit'

import * as user from './user'
import * as base from './base'
import * as chart from './chart'
import * as validators from './validators'
import * as allocatorActions from './allocatorActions'
import { vaultUserMethods, initialState as vaultUserInitialState } from './user'


export const vaultMethods = {
  base: base.methods,
  chart: chart.methods,
  user: vaultUserMethods,
  validators: validators.methods,
  allocatorActions: allocatorActions.methods,
}

export const initialState = {
  base: base.initialState,
  chart: chart.initialState,
  user: vaultUserInitialState,
  validators: validators.initialState,
  allocatorActions: allocatorActions.initialState,
}

export default combineReducers({
  user: user.default,
  base: base.default,
  chart: chart.default,
  validators: validators.default,
  allocatorActions: allocatorActions.default,
})
