'use client'
import { useCallback } from 'react'
import { useActions, useAutoFetch, useMintToken, useChainChanged } from 'hooks'
import { useConfig } from 'config'
import methods from 'helpers/methods'


type ExitStatsQueryPayload = {
  exitStats: {
    duration: number
  }
}

const useMintTokenData = () => {
  const { sdk } = useConfig()
  const actions = useActions()
  const fetchMintTokenData = useMintToken({ sdk })

  const fetchQueueDays = useCallback(async () => {
    try {
      const result = await methods.fetch<ExitStatsQueryPayload>(sdk.config.api.backend, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query ExitStats {
              exitStats {
                duration    
              }
            }
          `,
        }),
      })

      const days = result.exitStats.duration
      const secondsInDay = 86400

      return Number((days / secondsInDay).toFixed())
    }
    catch (error) {
      console.error('Stake: fetchQueueDays error', error as Error)
      return Promise.resolve(8)
    }
  }, [ sdk ])

  const fetchData = useCallback(async () => {
    const [
      queueDays,
      [ mintToken, rate ],
    ] = await Promise.all([
      fetchQueueDays(),
      fetchMintTokenData(),
    ])

    actions.mintToken.setData({
      ...mintToken,
      rate,
      queueDays,
    })
  }, [ actions, fetchMintTokenData, fetchQueueDays ])

  useChainChanged(fetchData)

  useAutoFetch({
    action: fetchData,
    interval: 1000 * 60 * 10,
  })
}


export default useMintTokenData
