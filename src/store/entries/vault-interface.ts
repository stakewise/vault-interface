import { configureStore } from '@reduxjs/toolkit'

import swapTokenRates from '../store/swapTokenRates'
import mintToken from '../store/mintToken'
import fiatRates from '../store/fiatRates'
import currency from '../store/currency'
import account from '../store/account'
import vault from '../store/vault'
import ui from '../store/ui'

import { serializeStore, serializableMiddleware } from '../utils'


export const createVaultInterfaceStore = (initialState?: string) => configureStore({
  reducer: {
    swapTokenRates,
    mintToken,
    fiatRates,
    currency,
    account,
    vault,
    ui,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({ serializableCheck : false })
      .concat(serializableMiddleware)
  ),
  devTools: !IS_PROD,
  preloadedState: serializeStore(initialState),
})
