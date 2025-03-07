import React from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import { IconName } from '../Image/Image'
import type { IconProps } from '../Icon/Icon'
import ButtonBase from '../ButtonBase/ButtonBase'
import type { ButtonBaseProps } from '../ButtonBase/ButtonBase'

import s from './RoundButton.module.scss'


export type RoundButtonSize = 16 | 24 | 32 | 48

export type RoundButtonColors = 'secondary' | 'dark'

const iconSizes: Record<RoundButtonSize, IconProps['size']> = {
  16: 16,
  24: 16,
  32: 24,
  48: 32,
} as const

export type RoundButtonProps = (
  ButtonBaseProps & {
    icon: IconName
    size: RoundButtonSize
    color: RoundButtonColors
    iconColor?: IconProps['color']
    ariaLabel: string | Intl.Message
  }
)

const RoundButton: React.FC<RoundButtonProps> = (props) => {
  const { className, disabled, icon, size, color, iconColor = 'dark', ariaLabel, ...rest } = props

  const iconSize = iconSizes[size]
  const buttonClassName = cx(s.button, className, s[`size-${size}`], s[`color-${color}`], 'rounded-full')

  return (
    <ButtonBase
      className={buttonClassName}
      ariaLabel={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      <Icon
        name={icon}
        size={iconSize}
        color={iconColor}
      />
    </ButtonBase>
  )
}


export default React.memo(RoundButton)
