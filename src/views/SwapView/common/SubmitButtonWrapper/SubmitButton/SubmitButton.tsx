import React, { useMemo } from 'react'
import forms from 'modules/forms'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'

import { Button, Tooltip } from 'components'
import type { ButtonProps as ButtonComponentProps } from 'components'

import messages from './messages'


export type SubmitButtonProps = {
  className?: string
  title: Intl.Message
  loading?: boolean
  disabled?: boolean
  tooltip?: Intl.Message
  isSkipFieldCheck?: boolean
  field: Forms.Field<bigint> | Forms.Field<string>
  color?: ButtonComponentProps['color']
  onClick: () => void
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className, field, title, loading, disabled, color, tooltip, isSkipFieldCheck, onClick } = props

  const { isReadOnlyMode } = useConfig()
  const { value, error } = forms.useFieldValue<string | bigint>(field)

  const isFilled = isSkipFieldCheck ? true : Boolean(value)
  const isButtonDisabled = isReadOnlyMode || disabled || !isFilled || Boolean(error)

  const buttonTitle = useMemo(() => {
    if (isReadOnlyMode) {
      return messages.readOnlyTitle
    }

    if (!value && !isSkipFieldCheck) {
      return commonMessages.enterAmount
    }

    return title
  }, [ title, value, isReadOnlyMode, isSkipFieldCheck ])

  const button = (
    <Button
      className={className}
      loading={loading}
      size="xl"
      type="submit"
      fullWidth
      color={color || 'primary'}
      dataTestId="submit-button"
      title={buttonTitle}
      disabled={isButtonDisabled}
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
