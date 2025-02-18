import {
  isPlain,
  configureStore,
} from '@reduxjs/toolkit'

import fiatRates from '../store/fiatRates'
import currency from '../store/currency'
import ui from '../store/ui'


export const createVaultInterfaceStore = () => configureStore({
  reducer: {
    fiatRates,
    currency,
    ui,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck : {
      isSerializable: (value: any) => typeof value === 'bigint' || isPlain(value),
    },
  }),
  devTools: !IS_PROD,
})
