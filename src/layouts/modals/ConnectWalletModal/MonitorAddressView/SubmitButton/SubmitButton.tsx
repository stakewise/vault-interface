import React from 'react'
import forms from 'sw-modules/forms'
import { commonMessages } from 'helpers'

import { Button } from 'components'


type SubmitButtonProps = {
  className?: string
  addressField: Forms.Field<string>
  loading?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className, addressField, loading } = props

  const isValid = forms.useFieldValidate(addressField)

  return (
    <Button
      className={className}
      fullWidth
      type="submit"
      loading={loading}
      disabled={!isValid}
      title={commonMessages.buttonTitle.connect}
      dataTestId="check-wallet-button"
    />
  )
}


export default React.memo(SubmitButton)
