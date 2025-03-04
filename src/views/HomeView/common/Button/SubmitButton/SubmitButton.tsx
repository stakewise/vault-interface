import React from 'react'
import { useConfig } from 'config'
import forms from 'sw-modules/forms'
import { commonMessages } from 'helpers'

import { Button as ButtonComponent } from 'components'
import { stakeCtx, Tab } from 'views/HomeView/StakeContext/util'
import type { ButtonProps as ButtonComponentProps } from 'components'


export type SubmitButtonProps = {
  className?: string
  title: Intl.Message
  loading?: boolean
  disabled?: boolean
  color?: ButtonComponentProps['color']
  onClick: () => void
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className, title, loading, disabled, color, onClick } = props

  const { isReadOnlyMode } = useConfig()
  const { tabs, field, percentField } = stakeCtx.useData()

  const { value, error } = forms.useFieldValue<string | bigint>(tabs.value === Tab.Unboost ? percentField : field)

  const buttonProps: ButtonComponentProps = {
    className,
    loading,
    size: 'xl',
    type: "submit",
    fullWidth: true,
    color: color || 'color1',
    dataTestId: 'submit-button',
    title: disabled || value ? title : commonMessages.enterAmount,
    disabled: disabled || !value || Boolean(error) || isReadOnlyMode,
    onClick,
  }

  return (
    <ButtonComponent {...buttonProps} />
  )
}


export default React.memo(SubmitButton)
