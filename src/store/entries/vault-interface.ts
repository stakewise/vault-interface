import {
  isPlain,
  configureStore,
} from '@reduxjs/toolkit'

import mintToken from '../store/mintToken'
import fiatRates from '../store/fiatRates'
import currency from '../store/currency'
import account from '../store/account'
import vault from '../store/vault'
import ui from '../store/ui'


export const createVaultInterfaceStore = (initialState?: unknown) => configureStore({
  reducer: {
    mintToken,
    fiatRates,
    currency,
    account,
    vault,
    ui,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck : {
      isSerializable: (value: any) => typeof value === 'bigint' || isPlain(value),
    },
  }),
  devTools: !IS_PROD,
  preloadedState: initialState,
})
