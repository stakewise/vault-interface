import { useState, useCallback, useEffect, useRef } from 'react'


const useFieldValidate = <V extends Forms.FieldValue>(field: Forms.Field<V>) => {
  const [ isValid, setValid ] = useState<boolean>(field.validateWithoutError())

  const savedValidStatusRef = useRef<boolean>()
  savedValidStatusRef.current = isValid

  const handleValidate = useCallback((field: Forms.Field<V>) => {
    const isValid = field.validateWithoutError()

    if (savedValidStatusRef.current !== isValid) {
      setValid(isValid)
    }
  }, [])

  useEffect(() => {
    field.subscribe('change', handleValidate)

    return () => {
      field.unsubscribe('change', handleValidate)
    }
  }, [])

  return isValid
}


export default useFieldValidate
