import { useEffect, useRef } from 'react'


type ChangeEffectDeps = ReadonlyArray<unknown>

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const firstMount = useRef(true)

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false
      return
    }
    effect()
  }, deps)
}

const usePrevious = <T extends ChangeEffectDeps>(deps: T): T => {
  const prevRef = useRef(deps)

  useEffect(() => {
    prevRef.current = deps
  }, deps)

  return prevRef.current
}

const useChangeEffect = <T extends ChangeEffectDeps>(
  effect: (...prevValue: T) => void,
  deps: T
): void => {
  const prevValue = usePrevious<T>(deps)

  useUpdateEffect(() => {
    effect(...prevValue)
  }, deps)
}


export default useChangeEffect
