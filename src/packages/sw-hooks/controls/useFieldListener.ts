'use client'
import { useEffect } from 'react'
import methods from 'sw-methods'


type Procedure = (...args: any[]) => void

// move to forms module
const useFieldListener = (
  field: Forms.Field<any>,
  handler: Procedure,
  wait = 0
) => {
  useEffect(() => {
    if (typeof handler === 'function') {
      const handleChangeField = wait
        ? methods.debounce(handler, wait)
        : handler

      field.subscribe('change', handleChangeField)

      return () => {
        field.unsubscribe('change', handleChangeField)
      }
    }
  }, [ wait, field, handler ])
}


export default useFieldListener
