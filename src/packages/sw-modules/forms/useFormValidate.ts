import { useState, useCallback, useEffect, useRef } from 'react'


const useFormValidate = <F extends Forms.FormValues>(form: Forms.Form<F>) => {
  const [ isValid, setValid ] = useState<boolean>(form.validateWithoutError())

  const savedValidStatusRef = useRef<boolean>()
  savedValidStatusRef.current = isValid

  const handleChange = useCallback(() => {
    const isValid = form.validateWithoutError()

    if (savedValidStatusRef.current !== isValid) {
      setValid(isValid)
    }
  }, [])

  useEffect(() => {
    form.subscribe('change', handleChange)

    return () => {
      form.unsubscribe('change', handleChange)
    }
  }, [])

  return isValid
}


export default useFormValidate
