'use client'
import { useEffect, useRef } from 'react'


const useMountedRef = () => {
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return mountedRef
}


export default useMountedRef
