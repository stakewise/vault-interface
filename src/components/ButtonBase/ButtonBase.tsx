import React, { useCallback } from 'react'
import { methods } from 'helpers'
import cx from 'classnames'

import s from './ButtonBase.module.scss'
import intl from 'modules/intl'


export type ButtonBaseProps = {
  children?: React.ReactNode
  className?: string
  id?: string
  tag?: string
  type?: string
  href?: string
  rel?: string
  role?: string
  target?: string
  tabIndex?: string
  download?: string
  disabled?: boolean
  dataTestId?: string
  ariaLabel?: string | Intl.Message
  ref?: React.RefObject<HTMLAnchorElement | HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

const ButtonBase: React.FC<ButtonBaseProps> = (props) => {
  const {
    children, id, className, disabled,
    dataTestId, ariaLabel, tabIndex, href, target,
    tag, rel, ref, download,
    type = 'button',

    onClick,
    ...otherProps
  } = props

  const defaultTag = href ? 'a' : 'button'
  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)

  const translations = intl.useIntl()

  const _ariaLabel = typeof ariaLabel === 'object'
    ? translations.formatMessage(ariaLabel, ariaLabel.values)
    : ariaLabel

  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (disabled) {
      return
    }

    if (typeof onClick === 'function') {
      onClick(event)
    }
  }, [ onClick, disabled ])

  const node: string | React.ElementType = tag || defaultTag

  const nodeProps: any = {
    ref,
    className: cx(className, s.wrapper, {
      'inline-flex items-center justify-center': !className?.split(' ').includes('flex'),
      'whitespace-nowrap': !className?.includes('whitespace-'),
      'pointer-events-none cursor-default': disabled,
      'cursor-pointer': !disabled,
    }),
    id,
    href,
    rel,
    type,
    target,
    download,
    disabled,
    tabIndex,
    role: 'button',
    ...htmlAttrs,
    'aria-label': _ariaLabel,
    'data-testid': dataTestId,
    onClick: handleClick,
  }

  return React.createElement(
    node,
    nodeProps,
    children
  )
}

ButtonBase.displayName = 'ButtonBase'


export default React.memo(ButtonBase)
