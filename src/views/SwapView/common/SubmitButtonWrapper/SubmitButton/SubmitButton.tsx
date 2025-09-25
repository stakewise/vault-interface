import React from 'react'
import forms from 'modules/forms'
import { commonMessages } from 'helpers'

import { Button, Tooltip } from 'components'
import type { ButtonProps as ButtonComponentProps } from 'components'


export type SubmitButtonProps = {
  className?: string
  title: Intl.Message
  loading?: boolean
  disabled?: boolean
  tooltip?: Intl.Message
  field: Forms.Field<bigint> | Forms.Field<string>
  color?: ButtonComponentProps['color']
  onClick: () => void
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className, field, title, loading, disabled, color, tooltip, onClick } = props

  const { value, error } = forms.useFieldValue<string | bigint>(field)

  const button = (
    <Button
      className={className}
      loading={loading}
      size="xl"
      type="submit"
      fullWidth
      color={color || 'primary'}
      dataTestId="submit-button"
      title={disabled || value ? title : commonMessages.enterAmount}
      disabled={disabled || !value || Boolean(error)}
      onClick={onClick}
    />
  )

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        {button}
      </Tooltip>
    )
  }

  return button
}


export default React.memo(SubmitButton)
