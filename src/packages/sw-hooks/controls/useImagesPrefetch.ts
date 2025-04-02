'use client'
import { useEffect } from 'react'

import cacheStorage from 'modules/cache-storage'


const cache = cacheStorage.get<string[]>('PREFETCHED_IMAGES')

const useImagesPrefetch = (images: Record<string, string>) => {
  useEffect(() => {
    if (!images || !Object.values(images).length) {
      return
    }

    const cacheResult = cache.getData() || []
    const newImages = Object.values(images).filter((image) => !cacheResult.includes(image))

    if (!newImages.length) {
      return
    }

    newImages.forEach((url) => {
      const link = document.createElement('link')

      link.rel = 'prefetch'
      link.as = 'image'
      link.href = url

      document.head.appendChild(link)
    })

    const uniqueArrayOfImages = [ ...cacheResult, ...newImages ]

    cache.setData(uniqueArrayOfImages, 0)
  }, [ images ])
}


export default useImagesPrefetch
