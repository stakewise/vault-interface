import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { wrapDispatchMethods } from 'sw-store'

import { uiMethods } from 'sw-store/store/ui'
import { accountMethods } from 'sw-store/store/account'
import { currencyMethods } from 'sw-store/store/currency'
import { fiatRatesMethods } from 'sw-store/store/fiatRates'
import { mintTokenMethods } from 'sw-store/store/mintToken'


const useActions = () => {
  const dispatch = useDispatch()

  return useMemo(() => ({
    ui: wrapDispatchMethods(uiMethods, dispatch),
    account: wrapDispatchMethods(accountMethods, dispatch),
    currency: wrapDispatchMethods(currencyMethods, dispatch),
    fiatRates: wrapDispatchMethods(fiatRatesMethods, dispatch),
    mintToken: wrapDispatchMethods(mintTokenMethods, dispatch),
  }), [])
}


export default useActions
