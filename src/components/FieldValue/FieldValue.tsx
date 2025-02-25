import React, { ReactNode } from 'react'

import forms from 'sw-modules/forms'


export type FieldValueProps = {
  children: (fieldState: ReturnType<typeof forms.useFieldValue>) => ReactNode
  field: Forms.Field<any>
}

const FieldValue: React.FC<FieldValueProps> = (props) => {
  const { children, field } = props

  const { value, error } = forms.useFieldValue(field)

  return (
    <>
      {
        children({ value, error })
      }
    </>
  )
}


export default React.memo(FieldValue)
