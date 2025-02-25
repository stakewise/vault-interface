import React from 'react'
import cx from 'classnames'

import Button, { ButtonProps } from '../../../Button/Button'

import s from './Buttons.module.scss'


type ButtonParams = {
  className?: string
  loading?: boolean
  disabled?: boolean
  size?: ButtonProps['size']
  type?: ButtonProps['type']
  title: Intl.Message | string
  dataTestId?: string
  onClick?: () => void
}

export type ButtonsProps = {
  size?: 'wide' | 'narrow'
  primaryButton?: ButtonParams
  secondaryButton?: ButtonParams
  customPrimaryButton?: React.ReactNode
}

const Buttons: React.FC<ButtonsProps> = (props) => {
  const { size, primaryButton, secondaryButton, customPrimaryButton } = props

  const isNarrow = size === 'narrow'

  return (
    <div className="flex mt-24 justify-end gap-16">
      {
        Boolean(secondaryButton) && (
          <Button
            className={cx(s.button, secondaryButton?.className, 'px-16', { 'flex-1': isNarrow })}
            title={secondaryButton?.title as string}
            size={secondaryButton?.size}
            color="crystal"
            withoutPadding
            fullWidthOnMobile
            dataTestId={secondaryButton?.dataTestId}
            disabled={secondaryButton?.disabled}
            loading={secondaryButton?.loading}
            onClick={secondaryButton?.onClick}
          />
        )
      }
      {
        React.isValidElement(customPrimaryButton) && (
          React.cloneElement(customPrimaryButton as React.ReactElement, {
            className: cx(s.button, customPrimaryButton.props?.className, 'px-16', {
              'flex-1': isNarrow,
            }),
          })
        )
      }
      {
        Boolean(primaryButton) && (
          <Button
            className={cx(s.button, primaryButton?.className, 'px-16', {
              'flex-1': isNarrow,
            })}
            title={primaryButton?.title as string}
            size={primaryButton?.size}
            type={primaryButton?.type}
            withoutPadding
            fullWidthOnMobile
            dataTestId={primaryButton?.dataTestId}
            disabled={primaryButton?.disabled}
            loading={primaryButton?.loading}
            onClick={primaryButton?.onClick}
          />
        )
      }
    </div>
  )
}


export default React.memo(Buttons)
