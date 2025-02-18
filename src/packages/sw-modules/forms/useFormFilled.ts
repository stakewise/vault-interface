import { useState, useCallback, useEffect, useRef } from 'react'


const useFormFilled = <F extends Forms.FormValues>(form: Forms.Form<F>) => {
  const [ isFilled, setFilled ] = useState<boolean>(false)

  const savedFilledStatusRef = useRef<boolean>()
  savedFilledStatusRef.current = isFilled

  const handleChange = useCallback(() => {
    const values = form.getValues()
    const isFilled = Object.values(values).every(Boolean)

    if (savedFilledStatusRef.current !== isFilled) {
      setFilled(isFilled)
    }
  }, [])

  useEffect(() => {
    form.subscribe('change', handleChange)

    return () => {
      form.unsubscribe('change', handleChange)
    }
  }, [])

  return isFilled
}


export default useFormFilled
