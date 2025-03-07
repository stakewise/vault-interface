import React, { forwardRef, useMemo } from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'

import ButtonBase from '../ButtonBase/ButtonBase'
import type { ButtonBaseProps } from '../ButtonBase/ButtonBase'
import ButtonContent, { ButtonContentProps } from './ButtonContent/ButtonContent'


export const buttonSizes = [ 'xs', 's', 'm', 'l', 'xl' ] as const

export const buttonColors = [ 'primary', 'secondary', 'light' ] as const

const iconSizes = {
  xs: 16,
  s: 16,
  m: 24,
  l: 28,
  xl: 32,
}

const titleSizes = {
  xs: 't12m',
  s: 't14m',
  m: 't14m',
  l: 't18m',
  xl: 't20b',
}

type ButtonSize = typeof buttonSizes[number]

type ButtonBgColor = typeof buttonColors[number]

type ButtonStyleProps = {
  rounded?: boolean
  size?: ButtonSize
  fullWidth?: boolean
  color?: ButtonBgColor
  withoutPadding?: boolean
  fullWidthOnMobile?: boolean
}

export type ButtonProps = (
  ButtonBaseProps
  & ButtonStyleProps
  & Omit<ButtonContentProps, 'color' | 'iconSize' | 'titleSize'>
)

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    icon,
    logo,
    arrow,
    title,
    loading,
    rounded,
    disabled,
    fullWidth,
    size = 'm',
    ariaLabel,
    dataTestId,
    withoutPadding,
    fullWidthOnMobile,
    color = 'primary',
    ...rest
  } = props

  if (!title && !ariaLabel) {
    console.warn('Button must have either a "title" or an "ariaLabel" for correct accessibility')
  }

  const { isDesktop } = device.useData()

  const hasAdditionalNode = Boolean(arrow || icon || logo)
  const iconSize = iconSizes[size] as ButtonContentProps['iconSize']
  const titleSize = titleSizes[size] as ButtonContentProps['titleSize']

  const contentColor = useMemo(() => {
    const isBaseColor = [ 'primary', 'secondary' ].includes(color)

    if (isBaseColor && !loading && !disabled) {
      return 'white'
    }

    return 'dark'
  }, [ loading, disabled, color ])

  const buttonSizeClassName = cx({
    'min-w-[28rem] h-[28rem]': size === 'xs',
    'min-w-32 h-32': size === 's',
    'min-w-[44rem] h-[44rem]': size === 'm',
    'min-w-60 h-60': size === 'l',
    'min-w-[70rem] h-[70rem]': size === 'xl',
  })

  const buttonPaddingClassName = cx({
    'px-16': hasAdditionalNode,
    'px-8': !hasAdditionalNode  && size === 'xs',
    'px-32': !hasAdditionalNode && size === 's',
    'px-40': !hasAdditionalNode && size === 'm',
    'px-48': !hasAdditionalNode && (size === 'l' || size === 'xl'),
  })

  const gradientClassName = cx(
    'bg-gradient-to-r',
    'hover:brightness-90 hover:contrast-125'
  )

  const bgClassName = cx({
    [gradientClassName]: color === 'primary' || color === 'secondary',
    'from-primary-start to-primary-end': color === 'primary',
    'from-secondary-start to-secondary-end': color === 'secondary',
    'bg-dark/05 hover:bg-dark/10 active:bg-dark/15': color === 'light',
  })

  const buttonClassName = cx(
    buttonSizeClassName,
    `text-${contentColor}`,
    'relative text-center', {
      'rounded-8': !rounded,
      'rounded-72': rounded,
      'w-full': fullWidth || !isDesktop && fullWidthOnMobile,
      [bgClassName]: !disabled && !loading,
      'bg-dark/15 opacity-30': disabled || loading,
      [buttonPaddingClassName]: title && !withoutPadding,
    }
  )

  return (
    <ButtonBase
      ref={ref}
      className={cx(buttonClassName, className)}
      disabled={disabled || loading}
      dataTestId={dataTestId}
      data-loading={loading}
      {...rest}
    >
      <ButtonContent
        icon={icon}
        logo={logo}
        arrow={arrow}
        title={title}
        loading={loading}
        iconSize={iconSize}
        color={contentColor as ButtonContentProps['color']}
        titleSize={titleSize}
      />
    </ButtonBase>
  )
})

Button.displayName = 'Button'


export default React.memo(Button)
