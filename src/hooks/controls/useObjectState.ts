'use client'
import { useCallback, useState } from 'react'
import equal from 'fast-deep-equal'


export type ParamCallback<T> = (state: T) => Partial<T>
export type SetStateParam<T> = Partial<T> | ParamCallback<T>
export type SetState<T> = (param: SetStateParam<T>) => void

const useObjectState = <T extends object>(initialState: T): [ T, SetState<T> ] => {
  const [ state, _setState ] = useState(initialState)

  const setState = useCallback((value: any) => (
    _setState((prevState) => {
      let newState = value

      if (typeof value === 'function') {
        newState = value(prevState)
      }

      const updatedState = {
        ...prevState,
        ...newState,
      }

      const isEqual = equal(updatedState, prevState)

      return isEqual ? prevState : updatedState
    })
  ), [])

  return [ state, setState ]
}


export default useObjectState
