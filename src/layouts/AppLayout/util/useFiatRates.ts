import { useCallback } from 'react'
import { useActions, useStore, useAutoFetch, useChainChanged } from 'hooks'
import { useConfig } from 'config'
import { methods } from 'helpers'


const storeSelector = (store: Store) => ({
  mintTokenRate: store.mintToken.rate,
})

const useFiatRates = () => {
  const { sdk } = useConfig()

  const actions = useActions()
  const { mintTokenRate } = useStore(storeSelector)

  const handleFetchFiatPrices = useCallback(async () => {
    if (!mintTokenRate) {
      return
    }

    try {
      const fiatRates = await methods.fetchFiatRates(sdk.config.network.chainId)

      if (fiatRates) {
        actions.fiatRates.setData(fiatRates)
      }
    }
    catch (error: any) {
      console.error('Fetch fiat rates error', error)
    }
  }, [ sdk, actions, mintTokenRate ])

  useChainChanged(handleFetchFiatPrices)

  useAutoFetch({
    action: handleFetchFiatPrices,
    interval: 15 * 60 * 1000,
    skip: !Number(mintTokenRate),
  })
}


export default useFiatRates
