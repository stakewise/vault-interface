import React, { forwardRef } from 'react'
import cx from 'classnames'

import Text from '../../Text/Text'
import Icon from '../../Icon/Icon'
import Logo from '../../Logo/Logo'
import ButtonBase from '../../ButtonBase/ButtonBase'

import type { LogoName } from '../../Image/Image'
import type { IconProps } from '../../Icon/Icon'
import type { ButtonProps } from '../../Button/Button'

import s from './SelectButton.module.scss'


type SelectButtonProps = ButtonProps & {
  logo?: LogoName
  disabled?: boolean
  isError?: boolean
  isActive?: boolean
}

const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>((props, ref) => {
  const { className, logo, title, disabled, isError, isActive, arrow = 'down', ...rest } = props

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
        className="text-center overflow-ellipsis"
        message={title as string}
        size="t14m"
        color="inherit"
      />
      {
        Boolean(arrow) && (
          <div
            className={cx('ml-4 flex items-center', s.arrow, {
              [s.active]: isActive,
            })}
          >
            <Icon
              className={s.icon}
              size={16}
              name={`arrow/${arrow}` as IconProps['name']}
              color={isActive ? 'primary' : 'dark'}
            />
          </div>
        )
      }
    </ButtonBase>
  )
})

SelectButton.displayName = 'SelectButton'


export default React.memo(SelectButton)
