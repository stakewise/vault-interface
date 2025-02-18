import { useCallback } from 'react'
import { useActions, useAutoFetch } from 'hooks'
import { useConfig } from 'config'
import methods from 'sw-methods'


const useFiatRates = () => {
  const actions = useActions()
  const { chainId } = useConfig()

  const handleFetchFiatPrices = useCallback(async () => {
    try {
      const fiatRates = await methods.fetchFiatRates(chainId)

      if (fiatRates) {
        actions.fiatRates.setData(fiatRates)
      }
    }
    catch (error: any) {
      console.error('Fetch fiat rates error', error)
    }
  }, [ actions, chainId ])

  useAutoFetch({
    action: handleFetchFiatPrices,
    interval: 15 * 60 * 1000,
  })
}


export default useFiatRates
