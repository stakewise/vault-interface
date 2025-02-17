import { useMemo, useRef, useEffect } from 'react'

import Field from './Field'
import createFormMethods from './helpers/createFormMethods'


const useForm = <F extends Forms.FormValues>(config: Forms.FieldsConfig<F>): Forms.Form<F> => {
  const formRef = useRef<Forms.Form<F> | null>(null)

  const form = useMemo<Forms.Form<F>>(() => {
    const fields = Object.keys(config).reduce((acc, name) => {
      const field = new Field({
        ...config[name as keyof F],
        formRef,
      })

      return {
        ...acc,
        [name]: field,
      }
    }, {} as Forms.Form<F>['fields'])

    const methods = createFormMethods<Forms.FieldValue, F>(fields)

    return {
      fields,
      ...methods,
    }
  }, []) // ATTN The form is initialised only once, to keep event subscribers from dropping out!

  formRef.current = form

  useEffect(() => {
    return () => {
      formRef.current = null
    }
  }, [])

  return formRef.current as Forms.Form<F>
}


export default useForm
