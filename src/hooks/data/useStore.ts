'use client'
import { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import equal from 'fast-deep-equal'


const useStore = <Result extends object>(selector: (store: Store) => Result): Result => {
  const resultRef = useRef<Result>()

  const deepEqualSelector = useCallback((store: Store) => {
    const result = selector(store)
    const isEqual = Boolean(resultRef.current) && equal(result, resultRef.current)

    if (!isEqual) {
      resultRef.current = result
    }

    return resultRef.current as Result
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return useSelector(deepEqualSelector)
}


export default useStore
