import React from 'react'

import forms from 'sw-modules/forms'


export type FieldValidProps = {
  children: (isValid: boolean) => React.ReactNode
  field: Forms.Field<any>
  filled?: boolean
}

const FieldValid: React.FC<FieldValidProps> = (props) => {
  const { children, field, filled } = props

  const isValid = forms.useFieldValidate(field)
  const isFilled = forms.useFieldFilled(field)

  return (
    <>
      {
        children(filled ? (isValid && isFilled) : isValid)
      }
    </>
  )
}


export default React.memo(FieldValid)
