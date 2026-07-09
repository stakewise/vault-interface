import React, { ReactNode, useMemo } from 'react'

import forms from 'modules/forms'


export type FormValidProps = {
  children: (fieldState: boolean) => ReactNode
  form: Forms.Form<any>
  filled?: boolean
  group?: string
}

const FormValid: React.FC<FormValidProps> = (props) => {
  const { children, form, filled, group } = props

  const options = useMemo(() => ({ group }), [ group ])

  const isValid = forms.useFormValidate(form, options)
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
