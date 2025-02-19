import React, { forwardRef, useMemo } from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'

import ButtonBase from '../ButtonBase/ButtonBase'
import type { ButtonBaseProps } from '../ButtonBase/ButtonBase'
import ButtonContent, { ButtonContentProps } from './ButtonContent/ButtonContent'


export const buttonSizes = [ 'xs', 's', 'm', 'l', 'xl' ] as const

export const buttonColors = [ 'color1', 'color2', 'crystal', 'moon', 'transparent' ] as const

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
    color = 'button1',
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
    const isFancyColor = [ 'color1', 'color2' ].includes(color)

    if (disabled || loading) {
      return 'moon'
    }

    if (color === 'moon') {
      return 'sun'
    }

    if (isFancyColor) {
      return 'snow'
    }

    return 'moon'
  }, [ color, loading, disabled ])

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

  const buttonClassName = cx(
    buttonSizeClassName,
    'relative text-center', {
      'rounded-8': !rounded,
      'rounded-72': rounded,
      'w-full': fullWidth || !isDesktop && fullWidthOnMobile,
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
