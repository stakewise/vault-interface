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

const useUserStats = (daysCount: number) => {
  const actions = useActions()
  const { sdk, address } = useConfig()
  const { vaultAddress } = useStore(storeSelector)

  const fetch = useCallback(async () => {
    const cacheKey = `${address}-${vaultAddress}-${daysCount}`
    const cachedData = cache.getData() || {}
    const cachedValue = cachedData[cacheKey]

    try {
      if (address) {
        if (cachedValue) {
          actions.vault.user.rewards.setData(cachedValue)
          return
        }

        actions.vault.user.rewards.setFetching(true)

        const data = await sdk.vault.getUserStats({
          daysCount,
          vaultAddress,
          userAddress: address,
        })

        actions.vault.user.rewards.setData(data)

        cache.setData({
          ...cachedData,
          [cacheKey]: data,
        })
      }
    }
    catch (error: any) {
      console.error('Fetch user stats fail', error)
      actions.vault.user.rewards.setFetching(false)
    }
  }, [ actions, address, daysCount, sdk, vaultAddress ])

  useEffect(() => {
    if (address) {
      fetch()
    }
    else {
      actions.vault.user.rewards.resetData()
    }
  }, [ address, actions, fetch ])
}


export default useUserStats
