import React from 'react'
import cx from 'classnames'

import Text from '../../Text/Text'
import Icon from '../../Icon/Icon'
import Logo from '../../Logo/Logo'
import ButtonBase from '../../ButtonBase/ButtonBase'
import type { ButtonProps } from '../../Button/Button'
import type { LogoName, IconName } from '../../Image/Image'

import s from './SelectButton.module.scss'


type SelectButtonProps = ButtonProps & {
  logo?: LogoName
  icon?: IconName
  disabled?: boolean
  isError?: boolean
  isActive?: boolean
  ref?: React.RefObject<HTMLButtonElement>
}

const SelectButton: React.FC<SelectButtonProps> = (props) => {
  const { className, logo, title, disabled, isError, isActive, icon, ref, ...rest } = props

  const defaultClassName = isActive ? 'text-primary': 'interaction-color-dark'

  return (
    <ButtonBase
      ref={ref}
      className={cx('flex py-12', className, s.selectButton, {
        'text-error': isError,
        [defaultClassName]: !isError,
      })}
      {...rest}
      disabled={disabled}
    >
      {
        Boolean(logo) && (
          <Logo
            className="mr-12"
            name={logo as LogoName}
          />
        )
      }
      <Text
        className="text-center overflow-ellipsis font-medium"
        message={title as string}
        size="sm"
        color="inherit"
      />
      {
        Boolean(icon) && (
          <div
            className={cx('ml-4 flex items-center', s.arrow, {
              [s.active]: isActive,
            })}
          >
            <Icon
              className={s.icon}
              size={16}
              name={icon as IconName}
              color={isActive ? 'primary' : 'dark'}
            />
          </div>
        )
      }
    </ButtonBase>
  )
}

SelectButton.displayName = 'SelectButton'


export default React.memo(SelectButton)
