import { useState, useCallback, useEffect, useMemo } from 'react'


const useFormValues = <F extends Forms.FormValues>(form: Forms.Form<F>) => {
  const [ hasErrors, setHasErrors ] = useState<boolean>(form.hasErrors())
  const [ values, setValues ] = useState<Forms.Values<F>>(form.getValues())

  const handleValues = useCallback(() => {
    const hasErrors = form.hasErrors()
    const values = form.getValues()

    setHasErrors(hasErrors)
    setValues(values)
  }, [])

  useEffect(() => {
    form.subscribe('change', handleValues)

    return () => {
      form.unsubscribe('change', handleValues)
    }
  }, [])

  return useMemo(() => ({
    values,
    hasErrors,
  }), [ values, hasErrors ])
}


export default useFormValues
