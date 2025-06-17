'use client'
import { useRef } from 'react'
import equal from 'fast-deep-equal'


const useDeepMemo = <T, V>(memoFn: () => V, deps: T): V => {
  const ref = useRef<{ deps: T; value: V } | null>(null)

  if (!ref.current || !equal(deps, ref.current.deps)) {
    ref.current = { deps, value: memoFn() }
  }

  return ref.current.value
}


export default useDeepMemo
