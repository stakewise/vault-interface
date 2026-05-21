'use client'
import { useState, useRef, useEffect } from 'react'
import CacheStorage from './CacheStorage'


type Output<T> = [ T, <D extends T>(data: D, time?: number) => void, boolean ]

const useCacheListener = <T = any>(cacheId: string): Output<T> => {
  const lastCacheId = useRef<string>(null)
  const cache = CacheStorage.get<T>(cacheId)
  const [ data, setData ] = useState<T>(cache.getData() as T)

  useEffect(() => {
    const handler = () => setData(cache.getData() as T)

    if (lastCacheId.current && lastCacheId.current !== cacheId) {
      handler()
    }

    lastCacheId.current = cacheId

    cache.addListener(handler)

    return () => cache.removeListener(handler)
  }, [ cache, cacheId ])

  return [ data, cache.setData.bind(cache), cache.isChanged ]
}


export default useCacheListener
