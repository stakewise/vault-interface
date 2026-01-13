'use client'
import { useEffect } from 'react'
import debounce from 'helpers/methods/debounce'


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
        ? debounce(handler, wait)
        : handler

      field.subscribe('change', handleChangeField)

      return () => {
        field.unsubscribe('change', handleChangeField)
      }
    }
  }, [ wait, field, handler ])
}


export default useFieldListener
