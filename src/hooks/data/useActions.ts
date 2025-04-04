import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { wrapDispatchMethods } from 'store'

import { uiMethods } from 'store/store/ui'
import { vaultMethods } from 'store/store/vault'
import { accountMethods } from 'store/store/account'
import { currencyMethods } from 'store/store/currency'
import { fiatRatesMethods } from 'store/store/fiatRates'
import { mintTokenMethods } from 'store/store/mintToken'


const useActions = () => {
  const dispatch = useDispatch()

  return useMemo(() => ({
    ui: wrapDispatchMethods(uiMethods, dispatch),
    vault: wrapDispatchMethods(vaultMethods, dispatch),
    account: wrapDispatchMethods(accountMethods, dispatch),
    currency: wrapDispatchMethods(currencyMethods, dispatch),
    fiatRates: wrapDispatchMethods(fiatRatesMethods, dispatch),
    mintToken: wrapDispatchMethods(mintTokenMethods, dispatch),
  }), [])
}


export default useActions
