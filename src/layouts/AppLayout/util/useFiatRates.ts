import { useCallback } from 'react'
import { useActions, useStore, useAutoFetch, useChainChanged } from 'hooks'
import { swapTokens } from 'helpers'
import { useConfig } from 'config'
import methods from 'helpers/methods'

import { fetchSwapTokenRates } from './_SSR'


const storeSelector = (store: Store) => ({
  mintTokenRate: store.mintToken.rate,
})

const useFiatRates = () => {
  const { sdk, chainId } = useConfig()

  const actions = useActions()
  const { mintTokenRate } = useStore(storeSelector)

  const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

  const handleFetchFiatPrices = useCallback(async () => {
    if (!mintTokenRate) {
      return
    }

    try {
      const fiatRates = await methods.fetchFiatRates(chainId)

      if (fiatRates) {
        actions.fiatRates.setData(fiatRates)
      }
    }
    catch (error: any) {
      console.error('Fetch fiat rates error', error)
    }
  }, [ chainId, actions, mintTokenRate ])

  const handleFetchSwapTokenRates = useCallback(async () => {
    if (!chainTokens) {
      return
    }

    try {
      const [ swapTokenRates, rates ] = await Promise.all([
        fetchSwapTokenRates(chainId),
        sdk.utils.getFiatRates(),
      ])

      const setValues = methods.createSetValues({
        EUR: rates['USD/EUR'],
        GBP: rates['USD/GBP'],
        CNY: rates['USD/CNY'],
        JPY: rates['USD/JPY'],
        KRW: rates['USD/KRW'],
        AUD: rates['USD/AUD'],
      })

      const swapTokenData = Object.keys(swapTokenRates).reduce((acc, key) => {
        acc[key] = setValues(swapTokenRates[key])

        return acc
      }, {} as Record<string, Record<Currency, number>>)

      actions.swapTokenRates.setData(swapTokenData)
    }
    catch (error: any) {
      console.error('Fetch swap token rates error', error)
    }
  }, [ sdk, actions, chainId, chainTokens ])

  useChainChanged(handleFetchFiatPrices)
  useChainChanged(handleFetchSwapTokenRates)

  useAutoFetch({
    action: handleFetchFiatPrices,
    interval: 15 * 60 * 1000,
    skip: !Number(mintTokenRate),
  })

  useAutoFetch({
    action: handleFetchSwapTokenRates,
    interval: 15 * 60 * 1000,
    skip: !chainTokens,
  })
}


export default useFiatRates
