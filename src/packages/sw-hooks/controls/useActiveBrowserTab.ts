'use client'
import { useEffect, useState, useMemo, useRef } from 'react'


const useActiveBrowserTab = () => {
  const [ isActive, setActive ] = useState(true)

  const isActiveRef = useRef(isActive)
  isActiveRef.current = isActive

  useEffect(() => {
    const handleBrowserTab = () => setActive(!document.hidden)

    document.addEventListener('visibilitychange', handleBrowserTab)

    return () => {
      document.removeEventListener('visibilitychange', handleBrowserTab)
    }
  }, [])

  return useMemo(() => ({
    isActive,
    isActiveRef,
  }), [ isActive ])
}


export default useActiveBrowserTab
