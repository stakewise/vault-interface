import { useCallback } from 'react'
// import { useActions, useAutoFetch } from 'hooks'
// import { analytics } from 'helpers'
import { useConfig } from 'config'
import methods from 'sw-methods'


const useFiatRates = () => {
  // const actions = useActions()
  const { chainId } = useConfig()

  // const handleFetchFiatPrices = useCallback(async () => {
  //   analytics.sentry.breadcrumb({
  //     category: 'blockchain',
  //     message: 'fetch fiat rates',
  //   })
  //
  //   try {
  //     const fiatRates = await methods.fetchFiatRates(chainId)
  //
  //     if (fiatRates) {
  //       actions.fiatRates.setData(fiatRates)
  //     }
  //   }
  //   catch (error: any) {
  //     analytics.sentry.exception('Fetch fiat rates error', error)
  //   }
  // }, [ chainId, actions ])
  //
  // useAutoFetch({
  //   action: handleFetchFiatPrices,
  //   interval: 15 * 60 * 1000,
  // })
}


export default useFiatRates
