import { useMemo } from 'react'

import Field from './Field'


const useField = <V extends Forms.FieldValue>(params: Forms.FieldConfig<V>): Forms.Field<V> => {
  return useMemo<Forms.Field<V>>(() => {
    const field = new Field(params)

    return field
  }, []) // ATTN The field is initialised only once, to keep event subscribers from dropping out!
}


export default useField
