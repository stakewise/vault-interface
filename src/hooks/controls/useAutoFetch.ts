'use client'
import { useCallback, useEffect, useState } from 'react'

import useActiveBrowserTab from './useActiveBrowserTab'


type UseAutoFetchProps = {
  action: () => Promise<void>
  skip?: boolean
  interval?: number
}

const useAutoFetch = (values: UseAutoFetchProps) => {
  const { action, skip, interval = 10_000 } = values

  const { isActive } = useActiveBrowserTab()
  const [ lastFetched, setLastFetched ] = useState<number | null>(null)

  const handleFetch = useCallback(async () => {
    try {
      await action()
    }
    catch {}

    setLastFetched(Date.now())
  }, [ action ])

  useEffect(() => {
    if (!skip && isActive) {
      let timeLeft = 0

      if (lastFetched) {
        const timeFromLastFetch = Date.now() - lastFetched

        timeLeft = Math.max(interval - timeFromLastFetch, 0)
      }

      if (timeLeft) {
        const timeout = setTimeout(() => {
          handleFetch()
        }, timeLeft || interval)

        return () => {
          clearTimeout(timeout)
        }
      }
      else {
        handleFetch()
      }
    }
  }, [ skip, interval, isActive, lastFetched, handleFetch ])
}


export default useAutoFetch
