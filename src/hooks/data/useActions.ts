import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { wrapDispatchMethods } from 'sw-store'

import { uiMethods } from 'sw-store/store/ui'
import { currencyMethods } from 'sw-store/store/currency'
import { fiatRatesMethods } from 'sw-store/store/fiatRates'


const useActions = () => {
  const dispatch = useDispatch()

  return useMemo(() => ({
    ui: wrapDispatchMethods(uiMethods, dispatch),
    currency: wrapDispatchMethods(currencyMethods, dispatch),
    fiatRates: wrapDispatchMethods(fiatRatesMethods, dispatch),
  }), [])
}


export default useActions
