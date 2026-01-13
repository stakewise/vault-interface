'use client'
import { useCallback } from 'react'
import insertMockE2E from 'helpers/methods/insertMockE2E'


type Input = {
  sdk: SDK
}

type Output = {
  apy: string
  feePercent: number
}

const useMintToken = (values: Input) => {
  const { sdk } = values

  const fetchAPY = useCallback(async () => {
    try {
      const mockE2E = insertMockE2E<Output>('fixtures/osToken/setOsTokenApy')

      if (mockE2E) {
        return mockE2E
      }

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
      console.error('Error useMintToken - fetchRate', error)

      return '0'
    }
  }, [ sdk ])

  return useCallback(() => Promise.all([
    fetchAPY(),
    fetchRate(),
  ]), [ fetchAPY, fetchRate ])
}


export default useMintToken
