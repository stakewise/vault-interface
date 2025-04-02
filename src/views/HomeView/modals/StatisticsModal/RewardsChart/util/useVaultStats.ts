import { useCallback, useEffect } from 'react'
import { useConfig } from 'config'

import { useActions, useStore } from 'hooks'
import cacheStorage from 'modules/cache-storage'


type Cache = Record<string, any>

const cache = cacheStorage.get<Cache>(UNIQUE_FILE_ID)
cache.setData({})

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

const useVaultStats = (daysCount: number) => {
  const { sdk } = useConfig()
  const actions = useActions()
  const { vaultAddress } = useStore(storeSelector)

  const fetch = useCallback(async () => {
    const cacheKey = `${vaultAddress}-${daysCount}`
    const cachedData = cache.getData() || {}
    const cachedValue = cachedData[cacheKey]

    if (cachedValue) {
      actions.vault.chart.setData(cachedValue)
      return
    }

    try {
      actions.vault.chart.setFetching(true)

      const data = await sdk.vault.getVaultStats({
        vaultAddress,
        daysCount,
      })

      actions.vault.chart.setData(data)

      cache.setData({
        ...cachedData,
        [cacheKey]: data,
      })
    }
    catch (error: any) {
      console.error('Fetch vault stats collection fail', error)
      actions.vault.chart.setFetching(false)
    }
  }, [ vaultAddress, daysCount, sdk, actions ])

  useEffect(() => {
    fetch()
  }, [ fetch ])
}


export default useVaultStats
