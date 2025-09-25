import { useCallback } from 'react'
import { useConfig } from 'config'
import { useActions } from 'hooks'
import { swapTokens, methods } from 'helpers'

import { fetchSwapTokenRates } from './_SSR'


const useFiatRates = () => {
  const actions = useActions()
  const { sdk, chainId } = useConfig()

  const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

  return useCallback(async () => {
    if (!chainTokens) {
      actions.swapTokenRates.setFetching(false)

      return
    }

    actions.swapTokenRates.setFetching(true)

    try {
      const [ fiatRates, swapTokenRates ] = await Promise.all([
        sdk.utils.getFiatRates(),
        fetchSwapTokenRates(chainId),
      ])

      const setValues = methods.createSetValues({
        EUR: fiatRates['USD/EUR'],
        GBP: fiatRates['USD/GBP'],
        CNY: fiatRates['USD/CNY'],
        JPY: fiatRates['USD/JPY'],
        KRW: fiatRates['USD/KRW'],
        AUD: fiatRates['USD/AUD'],
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
}


export default useFiatRates
