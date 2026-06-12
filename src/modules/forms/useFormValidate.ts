'use client'
import { useState, useCallback, useEffect, useRef } from 'react'


const useFormValidate = <F extends Forms.FormValues>(form: Forms.Form<F>, options: Forms.ValidateOptions = {}) => {
  const [ isValid, setValid ] = useState<boolean>(form.validateWithoutError(options))

  const savedValidStatusRef = useRef<boolean>(null)
  savedValidStatusRef.current = isValid

  const handleChange = useCallback(() => {
    const isValid = form.validateWithoutError(options)

    if (savedValidStatusRef.current !== isValid) {
      setValid(isValid)
    }
  }, [ form, options ])

  useEffect(() => {
    form.subscribe('change', handleChange)

    return () => {
      form.unsubscribe('change', handleChange)
    }
  }, [ form, handleChange ])

  return isValid
}


export default useFormValidate
