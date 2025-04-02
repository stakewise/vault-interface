import { useState, useCallback, useEffect, useRef } from 'react'


const useFieldFilled = <V extends Forms.FieldValue>(field: Forms.Field<V>) => {
  const [ isFilled, setFilled ] = useState<boolean>(false)

  const savedFilledStatusRef = useRef<boolean>()
  savedFilledStatusRef.current = isFilled

  const handleFilledate = useCallback((field: Forms.Field<V>) => {
    const isFilled = Boolean(field.value)

    if (savedFilledStatusRef.current !== isFilled) {
      setFilled(isFilled)
    }
  }, [])

  useEffect(() => {
    field.subscribe('change', handleFilledate)

    return () => {
      field.unsubscribe('change', handleFilledate)
    }
  }, [])

  return isFilled
}


export default useFieldFilled
