import { useState, useCallback, useEffect, useMemo } from 'react'


const useFieldValue = <V extends Forms.FieldValue>(field: Forms.Field<V>) => {
  const [ value, setValue ] = useState<V | undefined>(field.value)
  const [ error, setError ] = useState<Forms.Field<V>['error']>(field.error)

  const handleSetValue = useCallback((field: Forms.Field<V>) => {
    setValue(field.value)
  }, [])

  const handleSetError = useCallback((field: Forms.Field<V>) => {
    setError(field.error)
  }, [])

  useEffect(() => {
    field
      .subscribe('change', handleSetValue)
      .subscribe('error', handleSetError)

    return () => {
      field
        .unsubscribe('change', handleSetValue)
        .unsubscribe('error', handleSetError)
    }
  }, [])

  return useMemo(() => ({
    value,
    error,
  }), [ value, error ])
}


export default useFieldValue
