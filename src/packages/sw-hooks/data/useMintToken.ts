'use client'
import { useCallback } from 'react'


type Input = {
  sdk: SDK
}

const useMintToken = (values: Input) => {
  const { sdk } = values

  const fetchAPY = useCallback(async () => {
    try {
      const response = await sdk.osToken.getAPY()

      return response
    }
    catch (error: any) {
      console.error('Error useMintToken - fetchAPY', error)

      return {
        apy: '0',
        feePercent: 0,
      }
    }
  }, [ sdk ])

  const fetchRate = useCallback(async () => {
    try {
      const rate = await sdk.osToken.getRate()

      return rate
    }
    catch (error: any) {
      analytics.sentry.exception('Error useMintToken - fetchRate', error)

      return '0'
    }
  }, [ sdk ])

  return useCallback(() => Promise.all([
    fetchAPY(),
    fetchRate(),
  ]), [ fetchAPY, fetchRate ])
}


export default useMintToken
