import React, { ReactNode } from 'react'

import forms from 'modules/forms'


export type FormValidProps = {
  children: (fieldState: boolean) => ReactNode
  form: Forms.Form<any>
  filled?: boolean
}

const FormValid: React.FC<FormValidProps> = (props) => {
  const { children, form, filled } = props

  const isValid = forms.useFormValidate(form)
  const isFilled = forms.useFormFilled(form)

  return (
    <>
      {
        children(filled ? (isValid && isFilled) : isValid)
      }
    </>
  )
}


export default React.memo(FormValid)
