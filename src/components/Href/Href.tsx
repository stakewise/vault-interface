import React, { ReactNode, RefObject, forwardRef, useRef, useCallback } from 'react'
import { useEventListener } from 'hooks'
import NextLink from 'next/link'
import methods from 'helpers/methods'
import intl from 'modules/intl'


export type HrefProps = {
  children: ReactNode
  className?: string
  to?: string
  tabIndex?: string
  dataTestId?: string
  targetBlank?: boolean
  ariaLabel?: string | Intl.Message
  onClick?: () => void
}

const Href = forwardRef<HTMLAnchorElement, HrefProps>((props, ref) => {
  const { children, className, to, targetBlank, dataTestId, ariaLabel, onClick, ...otherProps } = props

  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)
  const isInternal = to && !/^(http|mailto)/.test(to)

  const componentRef = useRef<HTMLAnchorElement>()
  const _ref = (ref || componentRef) as RefObject<HTMLAnchorElement>

  const translations = intl.useIntl()

  const _ariaLabel = typeof ariaLabel === 'object'
    ? translations.formatMessage(ariaLabel)
    : ariaLabel

  // Handle enter click on focused link
  const handler = useCallback((event: any) => {
    if (event.keyCode === 13 && typeof onClick === 'function') {
      onClick()
    }
  }, [ onClick ])

  useEventListener('keyup', handler, _ref)

  if (isInternal) {
    return (
      <NextLink
        className={className}
        data-testid={dataTestId}
        aria-label={_ariaLabel}
        target={targetBlank ? '_blank' : undefined}
        ref={_ref}
        href={to}
        passHref
        onClick={onClick}
        {...htmlAttrs}
      >
        {children}
      </NextLink>
    )
  }

  return (
    <a
      // @ts-ignore
      ref={_ref}
      className={className}
      href={to}
      target={(to || targetBlank) ? '_blank' : undefined}
      rel="noopener noreferrer nofollow"
      onClick={onClick}
      aria-label={_ariaLabel}
      data-testid={dataTestId}
      {...htmlAttrs}
    >
      {children}
    </a>
  )
})

Href.displayName = 'Href'


export default React.memo(Href)
