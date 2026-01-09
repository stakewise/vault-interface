'use client'
import { useEffect } from 'react'


const useImagesPrefetch = (images: Record<string, string>, rel: 'prefetch' | 'preload' = 'prefetch') => {
  useEffect(() => {
    if (!images || !Object.values(images).length) {
      return
    }

    const newImages = Object.values(images)

    if (!newImages.length) {
      return
    }

    newImages.forEach((url) => {
      const link = document.createElement('link')

      link.rel = rel
      link.as = 'image'
      link.href = url

      document.head.appendChild(link)
    })
  }, [ images, rel ])
}


export default useImagesPrefetch
