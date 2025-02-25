'use client'
import { useCallback, useEffect } from 'react'
// import { fetchExitStatsQuery } from 'graphql/backend/exitQueue' // TODO replace with sdk
import { useActions, useAutoFetch, useMintToken } from 'hooks'
import { useConfig } from 'config'


const useMintTokenData = () => {
  const actions = useActions()
  const { sdk, isChainChanged } = useConfig()
  const fetchMintTokenData = useMintToken({ sdk })

  const fetchQueueDays = useCallback(async () => {
    try {
      const result = { exitStats: { duration: 0 } }
      // const result = await fetchExitStatsQuery({ url: sdk.config.api.backend })

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

  useEffect(() => {
    if (isChainChanged) {
      fetchData()
    }
  }, [ isChainChanged, fetchData ])

  useAutoFetch({
    action: fetchData,
    interval: 1000 * 60 * 10,
  })
}


export default useMintTokenData
