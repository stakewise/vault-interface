import React, { forwardRef, useMemo } from 'react'
import cx from 'classnames'

import { ButtonBase } from 'sw-components'
import type { ButtonBaseProps } from 'sw-components'

import ButtonContent from './ButtonContent/ButtonContent'
import type { ButtonContentProps } from './ButtonContent/ButtonContent'

import { getButtonStyleClassName, ButtonBgColor } from './util'


export const buttonSizes = [ 'lg', 'md', 'sm' ] as const

const iconSizes = {
  lg: 24,
  md: 24,
  sm: 16,
}

const titleSizes = {
  lg: 'f5',
  md: 'f6',
  sm: 'f7',
}

type ButtonSize = typeof buttonSizes[number]

type ButtonStyleProps = {
  size: ButtonSize
  bgColor?: ButtonBgColor
  fullWidth?: boolean
  fullWidthOnMobile?: boolean
}

export type ButtonProps = (
  ButtonBaseProps
  & ButtonStyleProps
  & Omit<ButtonContentProps, 'iconSize' | 'titleSize' | 'iconClassName'>
)

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className, disabled, title, icon, arrow, dataTestId,
    fullWidth, fullWidthOnMobile, loading,

    size,
    bgColor = 'primary',

    ...rest
  } = props

  const iconSize = iconSizes[size] as ButtonContentProps['iconSize']
  const titleSize = titleSizes[size] as ButtonContentProps['titleSize']

  const buttonSizeClassName = cx({
    'h-48': size === 'lg',
    'h-[42rem]': size === 'md',
    'h-32': size === 'sm',
  })

  const [ commonButtonPaddingClassName, textButtonPaddingClassName ] = [
    cx({
      'px-20': title && size === 'lg',
      'px-16': title && size === 'md',
      'px-12': title ? size === 'sm' : size === 'lg',
      'px-8': !title && (size === 'md' || size === 'sm'),
    }),
    cx('px-8', {
      '-mx-8': !fullWidth,
    }),
  ]

  const buttonPaddingClassName = [ 'textPrimary', 'textSecondary' ].includes(bgColor)
    ? textButtonPaddingClassName
    : commonButtonPaddingClassName

  const { buttonStyleClassName, buttonIconClassName, buttonContentClassName } = useMemo(() => (
    getButtonStyleClassName({ bgColor, loading, disabled })
  ), [ bgColor, loading, disabled ])

  const buttonClassName = cx(
    className,
    buttonStyleClassName,
    buttonPaddingClassName,
    'relative text-center rounded-8',
    {
      'w-full': fullWidth,
      'mobile:w-full': fullWidthOnMobile,
      [buttonSizeClassName]: !className?.includes('h-auto'),
    }
  )

  return (
    <ButtonBase
      ref={ref}
      className={buttonClassName}
      dataTestId={dataTestId}
      disabled={disabled || loading}
      {...rest}
    >
      <ButtonContent
        className={buttonContentClassName}
        iconClassName={buttonIconClassName}
        icon={icon}
        arrow={arrow}
        title={title}
        loading={loading}
        iconSize={iconSize}
        titleSize={titleSize}
      />
    </ButtonBase>
  )
})

Button.displayName = 'Button'


export default React.memo(Button)
