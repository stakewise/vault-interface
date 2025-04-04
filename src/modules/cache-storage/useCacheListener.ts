import { useState, useRef, useEffect } from 'react'
import cacheStorage from './CacheStorage'


type Output<T> = [ T, <D extends T>(data: D, time?: number) => void, boolean ]

const useCacheListener = <T = any>(cacheId: string): Output<T> => {
  const lastCacheId = useRef<string>()
  const cache = cacheStorage.get<T>(cacheId)
  const [ data, setData ] = useState<T>(cache.getData() as T)

  useEffect(() => {
    const handler = () => setData(cache.getData() as T)

    if (lastCacheId.current && lastCacheId.current !== cacheId) {
      handler()
    }

    lastCacheId.current = cacheId

    cache.addListener(handler)

    return () => cache.removeListener(handler)
  }, [ cacheId ])

  return [ data, cache.setData.bind(cache), cache.isChanged ]
}


export default useCacheListener
